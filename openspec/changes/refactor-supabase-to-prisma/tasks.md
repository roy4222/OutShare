# Tasks: Refactor Supabase to Prisma

## 1. 環境設定與基礎建設

- [x] 1.1 安裝 Prisma 和 Supabase CLI
  - `npm install -D prisma @prisma/client`
  - `npm install -D supabase`
  - 更新 `package.json` scripts
- [x] 1.2 初始化本地 Supabase
  - `npx supabase init`
  - 配置 `supabase/config.toml`
  - `npx supabase start` (需使用者手動執行)
- [x] 1.3 將現有 migrations 複製到 Supabase migrations 目錄
  - 從 `supabase/migrations/*.sql` 確保所有 schema 都已就緒
  - 新增 Auth trigger migration（自動建立 profile）
- [x] 1.4 建立 Prisma schema
  - `npx prisma init`
  - `npx prisma db pull` 從本地 Supabase 生成 schema (已手動建立)
  - 手動調整 schema（關聯、註解、欄位名稱）
- [x] 1.5 測試 Prisma 連線
  - 建立 `lib/prisma.ts`
  - 執行簡單查詢驗證連線正常 (需使用者執行 npm install 後測試)
- [x] 1.6 設定 Cloudflare R2 ⭐
  - 在 Cloudflare Dashboard 建立 R2 bucket（名稱：`outdoor-trails-images`）(需使用者手動建立)
  - 配置 CORS 政策 (需使用者手動設定)
  - 在 `wrangler.toml` 中綁定 R2 bucket
  - 取得 R2 access credentials（開發環境用）(需使用者手動取得)
- [x] 1.7 更新環境變數配置
  - 更新 `.env.local.example` (已建立文件說明)
  - 新增本地開發環境變數範例
  - 新增 R2 相關環境變數
  - 文件化環境變數說明

## 2. 資料服務層重構

- [ ] 2.1 建立 Prisma Client 單例
  - 建立 `lib/prisma.ts`
  - 處理 development vs production 環境
  - 加入 connection pooling 配置
- [ ] 2.2 建立 `lib/services/prisma/` 目錄結構
  - `lib/services/prisma/trips.service.ts`
  - `lib/services/prisma/equipment.service.ts`
  - `lib/services/prisma/profiles.service.ts`
  - `lib/services/prisma/index.ts`
- [ ] 2.3 實作 Trips Service
  - `getTripList(userId?: string)`
  - `getTripById(id: string, userId?: string)`
  - `createTrip(data: CreateTripInput, userId: string)`
  - `updateTrip(id: string, data: UpdateTripInput, userId: string)`
  - `deleteTrip(id: string, userId: string)`
  - `getTripBySlug(slug: string)`
- [ ] 2.4 實作 Equipment Service
  - `getEquipmentList(userId?: string, options?: { tripId?: string })`
  - `getEquipmentById(id: string, userId?: string)`
  - `createEquipment(data: CreateEquipmentInput, userId: string)`
  - `updateEquipment(id: string, data: UpdateEquipmentInput, userId: string)`
  - `deleteEquipment(id: string, userId: string)`
  - `getEquipmentByTrip(tripId: string)`
- [ ] 2.5 實作 Profiles Service
  - `getProfileByUserId(userId: string)`
  - `getProfileByUsername(username: string)`
  - `updateProfile(userId: string, data: UpdateProfileInput)`
  - `createProfile(userId: string, data: CreateProfileInput)`
- [ ] 2.6 加入權限檢查邏輯
  - 每個寫入操作驗證 `userId` 匹配
  - 建立 helper function `ensureOwnership()`
  - 加入錯誤處理（`UnauthorizedError`, `NotFoundError`）

## 3. React Hooks 更新

- [ ] 3.1 更新 `lib/hooks/useTrips.ts`
  - 改用 `prismaTripsService.getTripList()`
  - 移除 Supabase client 相關程式碼
  - 測試資料獲取功能
- [ ] 3.2 更新 `lib/hooks/useEquipment.ts`
  - 改用 `prismaEquipmentService.getEquipmentList()`
  - 移除 Supabase client 相關程式碼
  - 測試資料獲取功能
- [ ] 3.3 更新 `lib/hooks/useTripStats.ts`
  - 改用 Prisma service 計算統計資料
  - 測試統計功能正確性
- [ ] 3.4 建立 `lib/hooks/useProfile.ts`（如果尚未存在）
  - 使用 `prismaProfilesService.getProfileByUserId()`
  - 處理 loading 和 error 狀態

## 4. 前端組件更新

- [ ] 4.1 更新 `app/profile/page.tsx`
  - 使用新的 `useTrips` hook
  - 移除舊的 Supabase 相關 import
  - 測試頁面功能
- [ ] 4.2 更新 `app/GearDashboard/page.tsx`
  - 使用新的 `useEquipment` hook
  - 測試裝備列表顯示
- [ ] 4.3 更新 `app/[username]/page.tsx`（如果存在）
  - 使用 Prisma service 獲取 profile 資料
  - 測試公開頁面功能
- [ ] 4.4 檢查所有其他使用資料的組件
  - 搜尋專案中所有 `from '@/lib/services/supabase'` 的引用
  - 逐一更新為使用 Prisma services

## 5. API Routes 更新與檔案上傳

- [ ] 5.1 檢查 `app/api/` 目錄下的所有 API routes
  - 列出所有使用 Supabase 資料查詢的 routes
- [ ] 5.2 更新 trips 相關 API routes
  - 改用 Prisma services
  - 保持 API 介面不變
- [ ] 5.3 更新 gear/equipment 相關 API routes
  - 改用 Prisma services
  - 保持 API 介面不變
- [ ] 5.4 更新 profile 相關 API routes
  - 改用 Prisma services
  - 保持 API 介面不變
- [ ] 5.5 建立檔案上傳 API (`app/api/upload/route.ts`) ⭐
  - 實作圖片上傳到 Cloudflare R2
  - 支援圖片壓縮/調整大小（使用 sharp 或 browser 原生）
  - 回傳 R2 public URL
  - 加入檔案大小限制（5MB）
  - 加入檔案類型驗證（僅允許圖片）
- [ ] 5.6 建立檔案刪除 API (`app/api/upload/[key]/route.ts`)
  - 實作從 R2 刪除檔案
  - 驗證使用者權限（僅能刪除自己上傳的檔案）

## 6. Auth 相關程式碼簡化

- [ ] 6.1 審查並簡化 `lib/supabase/client.ts`
  - 確認僅用於 Auth 操作
  - 加入註解說明「僅用於 Auth，資料庫查詢請使用 Prisma」
  - 移除不必要的 Database 型別導入（如果只用 Auth）
- [ ] 6.2 審查並簡化 `lib/supabase/server.ts`
  - 確認僅用於 Auth 操作
  - 加入註解說明
- [ ] 6.3 審查 `lib/supabase/middleware.ts`
  - 確認僅處理 session 更新
  - 不涉及資料庫查詢
- [ ] 6.4 更新 `lib/hooks/useAuth.ts`
  - 確認僅使用 Supabase Auth API
  - 如需獲取 user profile，改用 Prisma service

## 7. 清理舊程式碼

- [ ] 7.1 移除 `lib/services/supabase/` 目錄
  - 確認所有功能已遷移到 Prisma services
  - 刪除 `equipment.service.ts`
  - 刪除 `trips.service.ts`
  - 刪除 `mapper.ts`
  - 刪除 `index.ts`
- [ ] 7.2 移除 `lib/database.types.ts`
  - 確認所有型別改用 Prisma 生成的型別
  - 搜尋專案中所有 `from '@/lib/database.types'` 引用並移除
- [ ] 7.3 清理 `data/` 目錄中的靜態資料檔案（如果已廢棄）
  - 評估是否仍需要 `data/trips.ts` 和 `data/equipment.ts`
  - 如不需要則刪除
- [ ] 7.4 更新 `.gitignore`
  - 新增 Prisma 生成檔案（`.prisma/client/`）
  - 新增 Supabase 本地檔案（`.supabase/`）

## 8. 測試與驗證

- [ ] 8.1 測試所有 CRUD 操作
  - Trips: 建立、讀取、更新、刪除
  - Equipment: 建立、讀取、更新、刪除
  - Profiles: 讀取、更新
- [ ] 8.2 測試權限控制
  - 驗證使用者只能修改自己的資料
  - 驗證未授權操作會正確拋出錯誤
- [ ] 8.3 測試前端功能
  - Profile 頁面完整流程
  - Gear Dashboard 完整流程
  - 公開頁面（`[username]`）完整流程
- [ ] 8.4 測試 Auth 流程
  - Google OAuth 登入
  - Session 持久化
  - 登出功能
- [ ] 8.5 效能測試
  - 比較 Prisma vs Supabase SDK 的查詢效能
  - 確保沒有 N+1 查詢問題

## 9. 文件更新

- [ ] 9.1 更新 `README.md`
  - 新增本地開發環境設定說明
  - 更新技術棧說明（Prisma）
  - 新增 Supabase CLI 使用指南
- [ ] 9.2 建立 `docs/database/PRISMA_GUIDE.md`
  - Prisma schema 說明
  - 如何新增/修改 models
  - Migration 工作流程
- [ ] 9.3 建立 `docs/database/LOCAL_SETUP.md`
  - 本地 Supabase 設定步驟
  - 環境變數配置
  - 常見問題排解
- [ ] 9.4 更新 `docs/Auth/AUTH_ARCHITECTURE.md`
  - 說明 Auth 與資料庫的分離
  - 更新架構圖
- [ ] 9.5 更新專案根目錄的 `openspec/project.md`
  - 更新技術棧資訊
  - 更新架構決策

## 10. 部署準備

- [ ] 10.1 更新環境變數設定文件
  - 生產環境的 `DATABASE_URL` 配置
  - Supabase Auth 相關環境變數
  - Cloudflare R2 credentials ⭐
- [ ] 10.2 更新 `wrangler.toml` 配置
  - 新增 R2 bucket 綁定
  - 配置環境變數
  - 確認 compatibility_date
- [ ] 10.3 更新 CI/CD 配置（如果存在）
  - 新增 Prisma migration 執行步驟
  - 新增 Prisma Client 生成步驟
  - 新增 Cloudflare Workers 部署步驟
- [ ] 10.4 建立生產環境 migration 計畫
  - 確認生產環境資料庫 schema 與本地一致
  - 準備 rollback 計畫
  - 規劃圖片遷移策略（Supabase Storage → R2）
- [ ] 10.5 更新部署文件
  - Cloudflare Workers 的 Prisma 配置
  - 資料庫連線設定
  - R2 bucket 設定與綁定說明

## 11. 最終檢查

- [ ] 11.1 執行完整的功能測試
  - 所有核心功能正常運作
  - 無明顯 bugs
- [ ] 11.2 檢查 TypeScript 型別錯誤
  - `npm run build` 成功
  - 無型別錯誤或警告
- [ ] 11.3 檢查 linter 錯誤
  - `npm run lint` 通過
- [ ] 11.4 Code review
  - 檢查程式碼品質
  - 確認符合專案規範
- [ ] 11.5 更新 `CHANGELOG.md`（如果存在）
  - 記錄此次重大變更
  - 說明 breaking changes

---

## 注意事項

⚠️ **重要提醒**：
1. 每完成一個大階段（1-11），請提交 Git commit
2. 保留舊程式碼直到新功能完全測試通過
3. 優先完成核心功能（Trips, Equipment），再處理次要功能
4. 遇到問題時，參考 `design.md` 中的決策說明
5. 所有資料庫操作都必須包含權限檢查（`userId` 驗證）

