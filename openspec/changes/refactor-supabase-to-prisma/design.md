# Design: Refactor Supabase to Prisma

## Context

目前專案使用 Supabase 作為 Backend-as-a-Service，包含：
- 身份驗證（Auth）- OAuth with Google
- PostgreSQL 資料庫
- Row Level Security (RLS)
- Realtime subscriptions（目前未使用）

現有問題：
1. 資料存取混亂：部分使用 Supabase SDK (`supabase.from('table')`)，部分準備使用 Prisma
2. 型別定義重複：`lib/database.types.ts` (Supabase 生成) vs Prisma types
3. 雲端依賴：開發時必須連接到雲端 Supabase，無法離線工作
4. 成本考量：小型專案使用雲端資料庫成本較高

## Goals / Non-Goals

### Goals
- ✅ 統一使用 Prisma 作為唯一的資料存取層（ORM）
- ✅ 保留 Supabase Auth（成熟穩定的 OAuth 解決方案）
- ✅ 建立本地開發環境（Supabase CLI + Docker）
- ✅ 提升型別安全和開發體驗
- ✅ 移除對雲端 Supabase 資料庫的依賴
- ✅ 保持 RLS 邏輯（在應用層實現）

### Non-Goals
- ❌ 移除 Supabase Auth（仍然使用）
- ❌ 改變現有的資料庫 schema 結構
- ❌ 重寫前端 UI 組件
- ❌ 改變部署平台（仍使用 Cloudflare Workers）

## Decisions

### 1. 保留 Supabase Auth，移除 Supabase 資料庫查詢

**Decision**: 僅使用 Supabase 的 Auth 服務，所有資料庫操作改用 Prisma。

**Rationale**:
- Supabase Auth 提供完整的 OAuth 流程，已經穩定運作
- 資料庫查詢使用 Prisma 可以獲得更好的型別推導和 IDE 支援
- 減少 vendor lock-in（未來可以更容易切換 Auth 提供商）

**Implementation**:
```typescript
// lib/supabase/client.ts - 僅保留 Auth 功能
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// 使用時僅呼叫 auth 相關方法
const supabase = createClient()
await supabase.auth.signInWithOAuth({ provider: 'google' })
await supabase.auth.getUser()

// ❌ 不再使用
// await supabase.from('trips').select('*')  // 改用 Prisma
```

### 2. 使用 Prisma 作為唯一的 ORM

**Decision**: 所有資料庫 CRUD 操作透過 Prisma Client。

**Rationale**:
- Prisma 提供優秀的型別安全和自動完成
- Migration 管理更清晰（`prisma migrate`）
- 更好的關聯查詢支援
- 可以輕鬆切換到其他 PostgreSQL 供應商

**Implementation**:
```typescript
// lib/services/prisma/trips.service.ts
import { prisma } from '@/lib/prisma'

export async function getTripList(userId?: string) {
  return await prisma.trip.findMany({
    where: userId ? { user_id: userId } : undefined,
    include: {
      trip_gear: {
        include: {
          gear: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  })
}
```

### 3. 本地 Supabase 開發環境

**Decision**: 使用 `supabase start` 在本地運行完整的 Supabase stack（包含 PostgreSQL）。

**Rationale**:
- 開發時不需要網路連接
- 更快的查詢響應時間
- 可以自由重置資料庫
- 與生產環境隔離，避免誤操作

**Setup**:
```bash
# 安裝 Supabase CLI
npm install -D supabase

# 初始化本地 Supabase
npx supabase init

# 啟動本地服務（PostgreSQL, Auth, Storage, etc.）
npx supabase start

# 執行 migrations
npx supabase db reset
```

**環境變數**:
```env
# .env.local (本地開發)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local_anon_key>
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### 4. RLS 邏輯移到應用層

**Decision**: 在 Prisma service 層實現資料存取控制，不依賴資料庫 RLS。

**Rationale**:
- Prisma 本身不支援 RLS（這是 PostgreSQL + Supabase 特有功能）
- 應用層控制更靈活，容易測試
- 可以更容易遷移到其他資料庫

**Implementation**:
```typescript
// lib/services/prisma/trips.service.ts
export async function getUserTrips(userId: string) {
  // 應用層檢查：只能查詢自己的 trips
  return await prisma.trip.findMany({
    where: { user_id: userId }
  })
}

export async function updateTrip(tripId: string, userId: string, data: UpdateTripInput) {
  // 先確認擁有者
  const trip = await prisma.trip.findUnique({ 
    where: { id: tripId } 
  })
  
  if (trip?.user_id !== userId) {
    throw new Error('Unauthorized')
  }
  
  return await prisma.trip.update({
    where: { id: tripId },
    data
  })
}
```

### 5. Prisma Schema 設計

**Decision**: 使用 `prisma db pull` 從現有資料庫生成 schema，然後手動調整。

**Schema 範例**:
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         String   @id @default(uuid()) @db.Uuid
  email      String   @unique
  created_at DateTime @default(now()) @db.Timestamptz(6)
  
  trips      Trip[]
  gear       Gear[]
  profile    Profile?
  
  @@map("users")  // Supabase auth.users table
}

model Profile {
  id                 String   @id @default(uuid()) @db.Uuid
  user_id            String   @unique @db.Uuid
  username           String?  @unique
  display_name       String?
  bio                String?
  avatar_url         String?
  gear_dashboard_title String?
  created_at         DateTime @default(now()) @db.Timestamptz(6)
  updated_at         DateTime @updatedAt @db.Timestamptz(6)
  
  user               User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@map("profiles")
}

model Trip {
  id          String   @id @default(uuid()) @db.Uuid
  user_id     String   @db.Uuid
  title       String
  description String?
  location    String?
  date        DateTime? @db.Date
  images      String[]
  slug        String?  @unique
  created_at  DateTime @default(now()) @db.Timestamptz(6)
  updated_at  DateTime @updatedAt @db.Timestamptz(6)
  
  user        User       @relation(fields: [user_id], references: [id], onDelete: Cascade)
  trip_gear   TripGear[]
  
  @@map("trip")
}

model Gear {
  id          String   @id @default(uuid()) @db.Uuid
  user_id     String   @db.Uuid
  name        String
  category    String?
  description String?
  image_url   String?
  specs       Json?
  tags        String[]
  created_at  DateTime @default(now()) @db.Timestamptz(6)
  updated_at  DateTime @updatedAt @db.Timestamptz(6)
  
  user        User       @relation(fields: [user_id], references: [id], onDelete: Cascade)
  trip_gear   TripGear[]
  
  @@map("gear")
}

model TripGear {
  id         String   @id @default(uuid()) @db.Uuid
  trip_id    String   @db.Uuid
  gear_id    String   @db.Uuid
  created_at DateTime @default(now()) @db.Timestamptz(6)
  
  trip       Trip     @relation(fields: [trip_id], references: [id], onDelete: Cascade)
  gear       Gear     @relation(fields: [gear_id], references: [id], onDelete: Cascade)
  
  @@unique([trip_id, gear_id])
  @@map("trip_gear")
}
```

## Risks / Trade-offs

### Risk 1: 失去 Supabase Realtime 功能
- **Impact**: 目前未使用 Realtime，但未來若需要即時同步會較困難
- **Mitigation**: 可以使用 WebSocket 或 Server-Sent Events 自行實現

### Risk 2: RLS 保護減少
- **Impact**: 資料庫層面不再有 RLS 保護，完全依賴應用層邏輯
- **Mitigation**: 
  - 在每個 service 函數嚴格檢查 `userId`
  - 撰寫完整的單元測試確保權限控制正確
  - 考慮使用 middleware 統一處理權限

### Risk 3: Migration 複雜度
- **Impact**: 大量程式碼需要重寫，可能引入 bugs
- **Mitigation**:
  - 分階段遷移（先 trips，再 gear，最後 profiles）
  - 每個階段完成後進行完整測試
  - 保留舊程式碼作為參考，待全部測試通過後再刪除

### Risk 4: 部署複雜度增加
- **Impact**: 需要額外部署 PostgreSQL 資料庫
- **Mitigation**:
  - 仍可使用 Supabase 雲端的 PostgreSQL（只是不用 Supabase SDK）
  - 或考慮 Neon、Railway 等 PostgreSQL 供應商
  - 確保 `DATABASE_URL` 在生產環境正確配置

## Migration Plan

### Phase 1: 環境設定 (Day 1)
1. 安裝 Supabase CLI 和 Prisma
2. 設定本地 Supabase (`supabase init`, `supabase start`)
3. 從現有資料庫生成 Prisma schema (`prisma db pull`)
4. 調整 schema 並測試 migrations
5. 更新環境變數配置

### Phase 2: 建立 Prisma Services (Day 2-3)
1. 建立 `lib/prisma.ts` (Prisma Client 單例)
2. 重寫 `lib/services/prisma/trips.service.ts`
3. 重寫 `lib/services/prisma/equipment.service.ts`
4. 撰寫單元測試驗證功能正確

### Phase 3: 更新 Hooks 和 Components (Day 4-5)
1. 更新 `lib/hooks/useTrips.ts`
2. 更新 `lib/hooks/useEquipment.ts`
3. 更新 `lib/hooks/useTripStats.ts`
4. 測試所有前端功能

### Phase 4: 清理和文件 (Day 6)
1. 移除 `lib/services/supabase/`
2. 簡化 `lib/supabase/client.ts` 和 `lib/supabase/server.ts`（僅保留 Auth）
3. 移除 `lib/database.types.ts`
4. 更新專案文件
5. 更新 README 和開發指南

### Rollback Plan
如果遇到重大問題：
1. 恢復 Git commit 到重構前
2. 保留本地 Supabase 設定供未來使用
3. 記錄遇到的問題，重新評估技術方案

## Open Questions

### ✅ 已決策

#### 1. **生產環境資料庫**
- **決定**: 繼續使用 Supabase 的 PostgreSQL，透過 Prisma 連接
- **理由**: 避免額外的資料庫遷移工作，Supabase PostgreSQL 穩定且已經包含在現有方案中

#### 2. **檔案儲存** ⭐ 
- **決定**: 遷移到 Cloudflare R2
- **理由**: 
  - 既然使用 Cloudflare Workers 部署，應該利用 R2 的零出口流量費優勢
  - 避免未來再次重構檔案上傳服務
  - R2 與 Workers 原生整合，效能更好
- **實施**: 在 Phase 1 就規劃好 R2 綁定和 API 服務
- **Migration Path**:
  1. 建立 R2 bucket
  2. 實作檔案上傳 API (`/api/upload`)
  3. 漸進式遷移現有圖片（保留舊 URL 作為 fallback）
  4. 更新前端上傳邏輯

#### 3. **Auth 用戶資料同步**
- **決定**: 使用 Supabase Database Trigger 自動建立 profile
- **實施**: 
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger AS $$
  BEGIN
    INSERT INTO public.profiles (user_id, username, created_at)
    VALUES (new.id, new.email, now());
    RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  ```

### ❓ 待決策

#### 4. **測試策略**
- **選項 A**: 僅手動測試關鍵功能
- **選項 B**: 撰寫整合測試（使用 Vitest + Testing Library）
- **選項 C**: 完整 E2E 測試（使用 Playwright）
- **建議**: 選項 B - 至少為 services 層撰寫整合測試

