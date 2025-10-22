# Database Layer Specification

## ADDED Requirements

### Requirement: Prisma 資料存取層

系統 SHALL 使用 Prisma 作為唯一的 ORM，處理所有資料庫查詢操作（包含 trips、gear、profiles 等資料表）。

#### Scenario: 查詢使用者的所有旅程

- **WHEN** 應用程式需要獲取特定使用者的旅程列表
- **THEN** 系統 MUST 使用 Prisma Client 執行查詢（不使用 Supabase SDK）
- **AND** 查詢 MUST 包含 `where: { user_id: userId }` 過濾條件
- **AND** 結果 MUST 按照 `created_at` 降序排列

#### Scenario: 建立新旅程並檢查權限

- **WHEN** 使用者嘗試建立新旅程
- **THEN** 系統 MUST 驗證 `userId` 與當前登入使用者匹配
- **AND** 系統 MUST 使用 Prisma 的 `create()` 方法插入資料
- **AND** `user_id` 欄位 MUST 設定為當前登入使用者的 ID

#### Scenario: 更新旅程前驗證擁有者

- **WHEN** 使用者嘗試更新特定旅程
- **THEN** 系統 MUST 先查詢該旅程的 `user_id`
- **AND** 系統 MUST 比對 `user_id` 與當前登入使用者
- **AND** 如果不匹配，系統 MUST 拋出 `UnauthorizedError`
- **AND** 僅在驗證通過後，系統 SHALL 執行 `update()` 操作

#### Scenario: 刪除旅程及其關聯資料

- **WHEN** 使用者刪除旅程
- **THEN** 系統 MUST 透過 Prisma 的 cascade delete 自動刪除關聯的 `trip_gear` 紀錄
- **AND** 系統 MUST 驗證使用者擁有該旅程的權限

---

### Requirement: Prisma Schema 定義

系統 SHALL 維護完整的 Prisma schema 檔案（`prisma/schema.prisma`），映射所有資料庫表結構和關聯。

#### Scenario: Schema 包含所有核心 Models

- **WHEN** 檢視 `prisma/schema.prisma`
- **THEN** 檔案 MUST 包含以下 models:
  - `User` (映射 `auth.users`)
  - `Profile` (映射 `public.profiles`)
  - `Trip` (映射 `public.trip`)
  - `Gear` (映射 `public.gear`)
  - `TripGear` (映射 `public.trip_gear`)
- **AND** 每個 model MUST 使用 `@@map()` 指定正確的資料表名稱

#### Scenario: Model 關聯正確定義

- **WHEN** 查詢 `Trip` 並包含關聯的 `Gear`
- **THEN** Prisma MUST 能透過 `include: { trip_gear: { include: { gear: true } } }` 獲取資料
- **AND** 型別系統 MUST 正確推導巢狀關聯的型別

#### Scenario: 自動產生 TypeScript 型別

- **WHEN** 執行 `npx prisma generate`
- **THEN** 系統 MUST 產生 `@prisma/client` 型別定義
- **AND** 所有 service 函數 MUST 使用生成的型別（如 `Prisma.TripCreateInput`）

---

### Requirement: 本地 Supabase 開發環境

系統 SHALL 支援使用本地 Supabase（透過 Docker）進行開發，不依賴雲端資料庫。

#### Scenario: 啟動本地 Supabase

- **WHEN** 開發者執行 `npx supabase start`
- **THEN** 系統 MUST 啟動本地 PostgreSQL 資料庫（port 54322）
- **AND** 系統 MUST 啟動本地 Supabase Auth 服務（port 54321）
- **AND** 系統 MUST 自動執行所有 migrations

#### Scenario: 重置本地資料庫

- **WHEN** 開發者執行 `npx supabase db reset`
- **THEN** 系統 MUST 清空資料庫
- **AND** 系統 MUST 重新執行所有 migrations
- **AND** 系統 MUST 執行 seed 資料（如果存在）

#### Scenario: 本地環境變數配置

- **WHEN** 開發者啟動本地開發伺服器
- **THEN** 系統 MUST 使用 `.env.local` 中的本地 Supabase URL
- **AND** `NEXT_PUBLIC_SUPABASE_URL` MUST 設為 `http://127.0.0.1:54321`
- **AND** `DATABASE_URL` MUST 指向本地 PostgreSQL (`postgresql://postgres:postgres@127.0.0.1:54322/postgres`)

---

### Requirement: Supabase 僅用於 Auth

系統 SHALL 保留 Supabase Auth 服務，但所有資料庫查詢 MUST 改用 Prisma。

#### Scenario: 使用 Supabase 進行 Google OAuth 登入

- **WHEN** 使用者點擊「使用 Google 登入」
- **THEN** 系統 MUST 呼叫 `supabase.auth.signInWithOAuth({ provider: 'google' })`
- **AND** 系統 MUST 正確處理 OAuth callback
- **AND** 系統 MUST 能夠獲取 `user.id` (UUID)

#### Scenario: 獲取當前登入使用者

- **WHEN** 應用程式需要確認使用者身份
- **THEN** 系統 MUST 呼叫 `supabase.auth.getUser()`
- **AND** 系統 MUST 返回包含 `id`, `email` 等基本資訊的 user 物件
- **AND** 系統 MUST NOT 使用 `supabase.from('users')` 查詢使用者資料

#### Scenario: 不使用 Supabase SDK 查詢資料庫

- **WHEN** 程式碼需要查詢 trips、gear 或 profiles
- **THEN** 程式碼 MUST NOT 包含 `supabase.from('table_name')`
- **AND** 程式碼 MUST 使用 `prisma.table_name.findMany()` 或類似方法
- **AND** ESLint 或 code review SHOULD 檢測並阻止使用 Supabase 進行資料查詢

---

### Requirement: 服務層架構

系統 SHALL 建立清晰的服務層（`lib/services/prisma/`），封裝所有資料庫操作邏輯。

#### Scenario: Trips Service 提供完整 CRUD 方法

- **WHEN** 檢視 `lib/services/prisma/trips.service.ts`
- **THEN** 檔案 MUST 提供以下函數:
  - `getTripList(userId?: string)`
  - `getTripById(id: string, userId?: string)`
  - `getTripBySlug(slug: string)`
  - `createTrip(data, userId)`
  - `updateTrip(id, data, userId)`
  - `deleteTrip(id, userId)`
- **AND** 每個寫入函數 MUST 包含 `userId` 參數用於權限檢查

#### Scenario: Equipment Service 支援過濾查詢

- **WHEN** 呼叫 `getEquipmentList({ userId: 'user123', tripId: 'trip456' })`
- **THEN** 系統 MUST 返回屬於 `user123` 且與 `trip456` 關聯的裝備
- **AND** 查詢 MUST 透過 `trip_gear` 關聯表過濾

#### Scenario: 服務層統一匯出

- **WHEN** 其他模組需要使用資料服務
- **THEN** 可以從 `@/lib/services/prisma` 統一 import
- **AND** 不需要知道內部檔案結構

---

### Requirement: 型別安全

系統 SHALL 使用 TypeScript 和 Prisma 生成的型別確保資料存取的型別安全。

#### Scenario: Service 函數參數型別化

- **WHEN** 呼叫 `createTrip(data, userId)`
- **THEN** `data` 參數 MUST 使用 `Prisma.TripCreateInput` 或自訂的 `CreateTripInput` 型別
- **AND** TypeScript MUST 在編譯時檢查型別錯誤
- **AND** IDE MUST 提供自動完成功能

#### Scenario: 查詢結果型別推導

- **WHEN** 執行 `const trip = await prisma.trip.findUnique({ where: { id } })`
- **THEN** TypeScript MUST 自動推導 `trip` 的型別為 `Trip | null`
- **AND** 存取不存在的欄位 MUST 產生編譯錯誤

#### Scenario: 移除 Supabase 生成的型別

- **WHEN** 檢查專案中的型別定義
- **THEN** 系統 MUST NOT 包含 `lib/database.types.ts`
- **AND** 所有引用 `Database` 型別的程式碼 MUST 已移除或改用 Prisma 型別

---

### Requirement: 權限控制在應用層

由於不使用資料庫 RLS，系統 SHALL 在應用層（service 函數）實現所有權限檢查。

#### Scenario: 禁止未授權修改

- **WHEN** 使用者 A 嘗試更新使用者 B 的旅程
- **THEN** `updateTrip(tripId, data, userA_id)` MUST 拋出 `UnauthorizedError`
- **AND** 資料庫 MUST NOT 被更新
- **AND** 錯誤訊息 MUST 為 "Unauthorized: You do not own this resource"

#### Scenario: 公開讀取不需驗證

- **WHEN** 訪客瀏覽公開的使用者頁面
- **THEN** `getTripList()` (不帶 `userId` 參數) MUST 返回所有公開旅程
- **OR** `getTripBySlug(slug)` MUST 返回對應的旅程，不需驗證權限

#### Scenario: 建立資源時自動綁定擁有者

- **WHEN** 呼叫 `createTrip(data, userId)`
- **THEN** 系統 MUST 自動將 `user_id` 設為傳入的 `userId`
- **AND** 系統 MUST 忽略 `data` 中任何手動設定的 `user_id`（防止偽造）

---

### Requirement: Migration 管理

系統 SHALL 使用 Prisma Migrate 管理資料庫 schema 變更，並與 Supabase migrations 協同工作。

#### Scenario: 建立新 migration

- **WHEN** 開發者修改 `prisma/schema.prisma`
- **THEN** 開發者 MUST 執行 `npx prisma migrate dev --name <description>`
- **AND** 系統 MUST 產生新的 migration 檔案於 `prisma/migrations/`
- **AND** 系統 MUST 自動執行該 migration

#### Scenario: 部署 migration 到生產環境

- **WHEN** 部署新版本到生產環境
- **THEN** CI/CD MUST 執行 `npx prisma migrate deploy`
- **AND** 系統 MUST 只執行尚未套用的 migrations
- **AND** 系統 MUST 記錄 migration 歷史於 `_prisma_migrations` 表

#### Scenario: 與 Supabase migrations 協同

- **WHEN** 專案同時有 Supabase 和 Prisma migrations
- **THEN** Supabase migrations (`supabase/migrations/*.sql`) SHOULD 處理初始 schema 建立
- **AND** Prisma migrations SHOULD 處理後續的 schema 變更
- **OR** 團隊 MUST 選擇其中一種作為主要 migration 工具

---

### Requirement: Cloudflare R2 檔案儲存

系統 SHALL 使用 Cloudflare R2 作為唯一的檔案儲存服務，取代 Supabase Storage。

#### Scenario: 上傳圖片到 R2

- **WHEN** 使用者上傳圖片（旅程照片、裝備照片、頭像）
- **THEN** 系統 MUST 透過 `/api/upload` API 將檔案上傳到 Cloudflare R2
- **AND** 系統 MUST 驗證檔案類型為圖片（jpg, png, webp, gif）
- **AND** 系統 MUST 限制檔案大小不超過 5MB
- **AND** 系統 MUST 回傳 R2 的 public URL

#### Scenario: 自動壓縮大型圖片

- **WHEN** 上傳的圖片超過 1MB
- **THEN** 系統 SHOULD 自動壓縮圖片品質
- **OR** 系統 SHOULD 提示使用者在前端先壓縮再上傳

#### Scenario: 刪除不再使用的圖片

- **WHEN** 使用者刪除旅程或更換頭像
- **THEN** 系統 MUST 呼叫 `/api/upload/[key]` DELETE 端點刪除舊圖片
- **AND** 系統 MUST 驗證使用者擁有該檔案的權限

#### Scenario: R2 bucket 綁定到 Cloudflare Workers

- **WHEN** 部署應用到 Cloudflare Workers
- **THEN** `wrangler.toml` MUST 包含 R2 bucket 綁定配置
- **AND** Workers 環境 MUST 能透過 `env.BUCKET_NAME` 存取 R2
- **AND** 不需要額外的 API 金鑰（使用 Workers binding）

#### Scenario: 本地開發環境使用 R2

- **WHEN** 在本地開發環境上傳檔案
- **THEN** 系統 MUST 使用 R2 API credentials（存於 `.env.local`）
- **OR** 系統 MAY 使用 Wrangler 的本地 R2 模擬（如果可用）
- **AND** 上傳功能 MUST 與生產環境行為一致

---

## REMOVED Requirements

### Requirement: Supabase SDK 資料查詢

**Reason**: 改用 Prisma 作為唯一的資料存取層，不再使用 Supabase SDK 進行資料庫查詢。

**Migration**: 
- 所有 `supabase.from('table').select()` 改為 `prisma.table.findMany()`
- 所有 `supabase.from('table').insert()` 改為 `prisma.table.create()`
- 所有 `supabase.from('table').update()` 改為 `prisma.table.update()`
- 所有 `supabase.from('table').delete()` 改為 `prisma.table.delete()`

### Requirement: Supabase 自動生成型別

**Reason**: 改用 Prisma 生成的 TypeScript 型別。

**Migration**:
- 移除 `lib/database.types.ts`
- 所有引用 `Database` 型別的地方改用 Prisma 型別
- 執行 `npx prisma generate` 產生新型別

### Requirement: Row Level Security (RLS)

**Reason**: Prisma 不支援 PostgreSQL RLS，改為在應用層實現權限控制。

**Migration**:
- 在每個 service 函數中加入 `userId` 檢查
- 確保所有寫入操作驗證擁有者身份
- 保留資料庫的 RLS policies（作為額外防護層），但不依賴它們

### Requirement: Supabase Storage

**Reason**: 改用 Cloudflare R2 作為檔案儲存服務，與 Cloudflare Workers 原生整合，享有零出口流量費優勢。

**Migration**:
- 所有圖片上傳改為呼叫 `/api/upload` (上傳到 R2)
- 現有 Supabase Storage 的圖片 URL 需要遷移：
  1. 方案 A（推薦）：建立遷移腳本，批次下載並重新上傳到 R2，更新資料庫 URL
  2. 方案 B：保留舊 URL 作為 fallback，新上傳使用 R2
- 移除所有 `supabase.storage.from('bucket')` 相關程式碼
- 更新前端元件使用新的上傳 API

---

## MODIFIED Requirements

_無需修改的現有需求_

---

## Notes

1. **漸進式遷移**: 建議先遷移 trips 相關功能，測試通過後再遷移 gear 和 profiles。
2. **保留 Supabase Auth**: 此規範明確說明 Supabase 僅用於身份驗證，不用於資料查詢。
3. **型別安全優先**: 充分利用 Prisma 的型別生成功能，確保編譯時捕捉錯誤。
4. **本地優先開發**: 鼓勵使用本地 Supabase，減少對雲端服務的依賴。
5. **測試覆蓋**: 由於移除了資料庫層的 RLS，應用層的權限檢查必須有完整的單元測試。

