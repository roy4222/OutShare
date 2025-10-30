# Prisma 到 Drizzle ORM 遷移計劃

## 遷移概述

將專案從 Prisma ORM 遷移至 Drizzle ORM，保持使用 Supabase Auth + PostgreSQL 的架構。

## 為什麼選擇 Drizzle？

1. **更輕量**：bundle size 更小，適合 Cloudflare Workers
2. **更接近 SQL**：查詢語法更直觀，接近原生 SQL
3. **更好的 TypeScript 支援**：完整的類型推導
4. **更靈活**：可以直接執行原生 SQL
5. **更快的啟動時間**：無需 schema generation

## 現有架構分析

### 資料模型
- **Profile**：使用者個人資料（user_id 主鍵）
- **Trip**：旅程記錄
- **Gear**：裝備資料
- **TripGear**：旅程與裝備的多對多關聯表

### 現有 Prisma 使用位置
1. `/lib/prisma.ts` - Prisma Client 單例
2. `/lib/services/prisma/profiles.service.ts` - Profile 查詢服務
3. `/lib/services/prisma/trips.service.ts` - Trip 查詢服務
4. `/lib/services/prisma/equipment.service.ts` - Equipment 查詢服務
5. API Routes：
   - `/app/api/profiles/route.ts`
   - `/app/api/profiles/[username]/route.ts`
   - `/app/api/trips/route.ts`
   - `/app/api/trips/[id]/route.ts`
   - `/app/api/equipment/route.ts`
   - `/app/api/equipment/[id]/route.ts`
6. `/app/auth/callback/route.ts` - Auth callback
7. Hooks：
   - `/lib/hooks/useProfile.ts`
   - `/lib/hooks/useProtectedUser.tsx`

## 遷移步驟

### 階段 1：安裝 Drizzle 和依賴

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
npm uninstall @prisma/client prisma
```

### 階段 2：創建 Drizzle Schema

創建 `/lib/db/schema.ts`，定義所有資料表 schema：
- profiles
- trip
- gear
- trip_gear

### 階段 3：設定 Drizzle 配置

1. 創建 `/drizzle.config.ts` - Drizzle Kit 配置
2. 創建 `/lib/db/index.ts` - Database client 單例
3. 更新環境變數設定

### 階段 4：遷移服務層

逐個遷移服務檔案：
1. profiles.service.ts
2. trips.service.ts
3. equipment.service.ts

### 階段 5：更新 API Routes

更新所有 API routes 使用新的 Drizzle 服務。

### 階段 6：清理 Prisma 相關檔案

1. 刪除 `/prisma` 目錄
2. 刪除 `/lib/prisma.ts`
3. 更新 `package.json` scripts
4. 清理文檔中的 Prisma 參考

### 階段 7：測試和驗證

1. 測試所有 CRUD 操作
2. 驗證 Auth callback 流程
3. 檢查資料關聯查詢
4. 確認權限檢查正常運作

## Drizzle vs Prisma 語法對照

### 查詢單筆資料
```typescript
// Prisma
const profile = await prisma.profile.findUnique({
  where: { user_id: userId }
})

// Drizzle
const profile = await db.query.profiles.findFirst({
  where: eq(profiles.user_id, userId)
})
```

### 查詢多筆資料
```typescript
// Prisma
const trips = await prisma.trip.findMany({
  where: { user_id: userId },
  orderBy: { created_at: 'desc' }
})

// Drizzle
const trips = await db.query.trip.findMany({
  where: eq(trip.user_id, userId),
  orderBy: desc(trip.created_at)
})
```

### 建立資料
```typescript
// Prisma
const trip = await prisma.trip.create({
  data: {
    user_id: userId,
    title: 'My Trip',
  }
})

// Drizzle
const [trip] = await db.insert(trip).values({
  user_id: userId,
  title: 'My Trip',
}).returning()
```

### 更新資料
```typescript
// Prisma
const trip = await prisma.trip.update({
  where: { id: tripId },
  data: { title: 'New Title' }
})

// Drizzle
const [trip] = await db.update(trip)
  .set({ title: 'New Title' })
  .where(eq(trip.id, tripId))
  .returning()
```

### 刪除資料
```typescript
// Prisma
await prisma.trip.delete({
  where: { id: tripId }
})

// Drizzle
await db.delete(trip).where(eq(trip.id, tripId))
```

### 關聯查詢
```typescript
// Prisma
const trip = await prisma.trip.findUnique({
  where: { id: tripId },
  include: {
    trip_gear: {
      include: { gear: true }
    }
  }
})

// Drizzle
const trip = await db.query.trip.findFirst({
  where: eq(trip.id, tripId),
  with: {
    trip_gear: {
      with: { gear: true }
    }
  }
})
```

## 注意事項

1. **Supabase Auth 保持不變**：只遷移資料層，Auth 仍使用 Supabase
2. **資料庫不需變更**：Drizzle 使用現有的 PostgreSQL schema
3. **Migration 管理**：使用 Drizzle Kit 的 `drizzle-kit push` 或 `drizzle-kit generate`
4. **Connection Pooling**：考慮使用 `@neondatabase/serverless` 或 Supabase connection pooling
5. **Cloudflare Workers**：Drizzle 更適合 edge runtime

## 預估時間

- 階段 1-2：1-2 小時
- 階段 3-4：3-4 小時
- 階段 5-6：2-3 小時
- 階段 7：2-3 小時

**總計**：約 8-12 小時

## 回滾計劃

如果遷移失敗，可以：
1. Git revert 回到遷移前的 commit
2. 重新安裝 Prisma 依賴
3. 執行 `prisma generate`

## 下一步

準備好開始遷移了嗎？我可以協助你：
1. ✅ 安裝 Drizzle 和相關依賴
2. ✅ 創建 Drizzle schema
3. ✅ 逐步遷移服務層
4. ✅ 測試和驗證

請確認是否要開始執行遷移！
