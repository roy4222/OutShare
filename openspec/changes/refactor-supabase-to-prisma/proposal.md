# Refactor Supabase to Prisma

## Why

目前專案同時使用 Supabase SDK 和 Prisma 來存取資料庫，造成架構混亂和維護困難。我們需要簡化資料存取層，改為：
- **保留 Supabase Auth**：繼續使用 Supabase 的身份驗證服務（OAuth、Session 管理）
- **改用 Prisma 進行所有資料庫操作**：統一使用 Prisma Client 來查詢和修改資料
- **使用本地 Supabase（Docker）**：透過 Supabase CLI 在本地運行完整的 Supabase stack，方便開發和測試

這樣可以：
1. 減少依賴複雜度（不需要同時維護兩套資料存取邏輯）
2. 提升型別安全（Prisma 提供完整的 TypeScript 型別）
3. 改善開發體驗（本地開發環境更快速、可離線工作）
4. 降低雲端成本（資料庫在本地運行）

## What Changes

- **BREAKING** 移除所有使用 Supabase SDK 進行資料庫查詢的程式碼
- **BREAKING** 將 `lib/services/supabase/` 重構為 `lib/services/prisma/`
- **BREAKING** 遷移檔案儲存從 Supabase Storage 到 Cloudflare R2
- 保留 `lib/supabase/client.ts` 和 `lib/supabase/server.ts`（僅用於 Auth）
- 建立 Prisma schema，映射現有的資料庫結構
- 設定本地 Supabase 開發環境（使用 Docker）
- 設定 Cloudflare R2 bucket 並實作檔案上傳 API
- 更新所有 React Hooks 改用 Prisma services
- 更新環境變數配置（指向本地 Supabase 與 R2）
- 移除 `lib/database.types.ts`（改用 Prisma 生成的型別）

## Impact

### Affected Specs
- `database-layer` - 全新的資料存取層規範

### Affected Code
- `lib/services/supabase/` → 移除並重寫為 `lib/services/prisma/`
  - `equipment.service.ts`
  - `trips.service.ts`
  - `mapper.ts`
- `lib/supabase/client.ts` → 保留但簡化（僅 Auth）
- `lib/supabase/server.ts` → 保留但簡化（僅 Auth）
- `lib/database.types.ts` → 移除
- `lib/hooks/useEquipment.ts` → 更新為使用 Prisma service
- `lib/hooks/useTrips.ts` → 更新為使用 Prisma service
- `lib/hooks/useTripStats.ts` → 更新為使用 Prisma service
- `app/profile/page.tsx` → 更新資料獲取邏輯
- `app/GearDashboard/page.tsx` → 更新資料獲取邏輯
- `app/api/upload/route.ts` → 建立（檔案上傳到 R2）
- `prisma/schema.prisma` → 建立（目前不存在）
- `supabase/config.toml` → 建立本地 Supabase 配置
- `wrangler.toml` → 更新（R2 bucket 綁定）
- `.env.local.example` → 更新環境變數範例（含 R2）
- `package.json` → 新增 Prisma 和 Supabase CLI 相關 scripts

### Migration Path
1. 設定本地 Supabase 環境
2. 設定 Cloudflare R2 bucket
3. 建立 Prisma schema
4. 重寫資料服務層
5. 實作檔案上傳 API（R2）
6. 更新所有使用資料的組件和 hooks
7. 遷移現有圖片到 R2
8. 移除舊的 Supabase 資料查詢程式碼
9. 更新文件和部署配置

