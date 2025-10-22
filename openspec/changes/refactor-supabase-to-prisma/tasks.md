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

- [x] 2.1 建立 Prisma Client 單例
  - 建立 `lib/prisma.ts`
  - 處理 development vs production 環境
  - 加入 connection pooling 配置
- [x] 2.2 建立 `lib/services/prisma/` 目錄結構
  - `lib/services/prisma/trips.service.ts`
  - `lib/services/prisma/equipment.service.ts`
  - `lib/services/prisma/profiles.service.ts`
  - `lib/services/prisma/index.ts`
- [x] 2.3 實作 Trips Service
  - `getTripList(userId?: string)`
  - `getTripById(id: string, userId?: string)`
  - `createTrip(data: CreateTripInput, userId: string)`
  - `updateTrip(id: string, data: UpdateTripInput, userId: string)`
  - `deleteTrip(id: string, userId: string)`
  - `getTripBySlug(slug: string)`
- [x] 2.4 實作 Equipment Service
  - `getEquipmentList(userId?: string, options?: { tripId?: string })`
  - `getEquipmentById(id: string, userId?: string)`
  - `createEquipment(data: CreateEquipmentInput, userId: string)`
  - `updateEquipment(id: string, data: UpdateEquipmentInput, userId: string)`
  - `deleteEquipment(id: string, userId: string)`
  - `getEquipmentByTrip(tripId: string)`
- [x] 2.5 實作 Profiles Service
  - `getProfileByUserId(userId: string)`
  - `getProfileByUsername(username: string)`
  - `updateProfile(userId: string, data: UpdateProfileInput)`
  - `createProfile(userId: string, data: CreateProfileInput)`
- [x] 2.6 加入權限檢查邏輯
  - 每個寫入操作驗證 `userId` 匹配
  - 在每個 create/update/delete 函數中加入權限檢查
  - 加入錯誤處理（Unauthorized, NotFound errors）

## 3. React Hooks 更新

- [x] 3.1 更新 `lib/hooks/useTrips.ts`
  - 改用 API Route (`/api/trips`)
  - 移除 Supabase client 相關程式碼
  - 使用 fetch 呼叫 API
- [x] 3.2 更新 `lib/hooks/useEquipment.ts`
  - 改用 API Route (`/api/equipment`)
  - 移除 Supabase client 相關程式碼
  - 使用 fetch 呼叫 API
- [x] 3.3 更新 `lib/hooks/useTripStats.ts`
  - 改用 API Route (`/api/equipment?tripId=...`)
  - 在 client side 計算統計資料
- [x] 3.4 更新 `lib/hooks/useProfile.ts`
  - 使用 API Route (`/api/profiles`)
  - 新增 `useProfileByUsername` (使用 `/api/profiles/[username]`)
  - 處理 loading 和 error 狀態

## 4. 前端組件更新

- [x] 4.1 檢查 Supabase services 引用
  - 搜尋專案中所有 `from '@/lib/services/supabase'` 的引用
  - 確認已全部更新為使用 API Routes
- [x] 4.2 前端組件無需更新
  - Hooks 已更新為呼叫 API Routes
  - 組件使用的 Hooks interface 保持不變
  - 無需修改組件程式碼

## 5. API Routes 更新與檔案上傳

- [x] 5.1 檢查 `app/api/` 目錄下的所有 API routes
  - 列出所有使用 Supabase 資料查詢的 routes（目前只有 auth/callback）
- [x] 5.2 建立 trips 相關 API routes
  - `app/api/trips/route.ts` - GET (列表), POST (建立)
  - `app/api/trips/[id]/route.ts` - GET, PUT, DELETE
  - 使用 Prisma services
- [x] 5.3 建立 gear/equipment 相關 API routes
  - `app/api/equipment/route.ts` - GET (列表), POST (建立)
  - `app/api/equipment/[id]/route.ts` - GET, PUT, DELETE
  - 使用 Prisma services
- [x] 5.4 建立 profile 相關 API routes
  - `app/api/profiles/route.ts` - GET (當前使用者), PUT (更新)
  - `app/api/profiles/[username]/route.ts` - GET (公開查詢)
  - 使用 Prisma services
- [ ] 5.5 建立檔案上傳 API (`app/api/upload/route.ts`) ⭐ (保留給未來實作)
  - 實作圖片上傳到 Cloudflare R2
  - 支援圖片壓縮/調整大小（使用 sharp 或 browser 原生）
  - 回傳 R2 public URL
  - 加入檔案大小限制（5MB）
  - 加入檔案類型驗證（僅允許圖片）
- [ ] 5.6 建立檔案刪除 API (`app/api/upload/[key]/route.ts`) (保留給未來實作)
  - 實作從 R2 刪除檔案
  - 驗證使用者權限（僅能刪除自己上傳的檔案）

**註**: R2 檔案上傳功能保留給未來實作，目前先專注於核心資料層的重構

## 6. Auth 相關程式碼簡化

- [x] 6.1 更新 `lib/supabase/client.ts`
  - ✅ 確認僅用於 Auth 操作
  - ✅ 加入詳細註解說明「僅用於 Auth，資料庫查詢請使用 API Routes」
  - ✅ 加入架構說明圖
- [x] 6.2 更新 `lib/supabase/server.ts`
  - ✅ 確認僅用於 Auth 操作
  - ✅ 加入詳細註解和使用範例
  - ✅ 說明如何在 API Routes 中正確使用
- [x] 6.3 `lib/supabase/middleware.ts` 無需更新
  - ✅ 已確認僅處理 session 更新
  - ✅ 不涉及資料庫查詢
- [x] 6.4 `lib/hooks/useAuth.ts` 無需更新
  - ✅ 僅使用 Supabase Auth API
  - ✅ Profile 資料透過 `useProfile` hook 獲取（已使用 API）

## 7. 清理舊程式碼

- [x] 7.1 備份 `lib/services/supabase/` 目錄
  - ✅ 移動到 `lib/services/_deprecated_supabase/`
  - ✅ 保留供參考，所有功能已遷移到 Prisma services
- [x] 7.2 保留 `lib/database.types.ts`
  - ✅ 仍被 Auth 相關檔案使用（`lib/supabase/client.ts`, `lib/supabase/server.ts`）
  - ✅ Supabase Auth 需要 Database 型別定義
- [x] 7.3 `data/` 目錄無需清理
  - ✅ 靜態資料檔案仍在使用中
- [x] 7.4 `.gitignore` 已包含必要規則
  - ✅ `.prisma/` 已在 `.gitignore`
  - ✅ `.supabase/` 已在 `.gitignore`

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

- [x] 9.1 建立 `IMPLEMENTATION_COMPLETE.md`
  - ✅ 完整實作總結
  - ✅ 架構改變說明
  - ✅ API 端點文件
  - ✅ 啟動指南
- [x] 9.2 建立 `REFACTOR_PROGRESS.md`
  - ✅ 進度記錄
  - ✅ 資料流程範例
  - ✅ 已建立檔案清單
- [x] 9.3 建立 `lib/services/prisma/README.md`
  - ✅ Prisma Services 使用說明
  - ✅ API 參考
  - ✅ 權限模型說明
  - ✅ 測試指南
- [x] 9.4 更新 `lib/supabase/client.ts` 和 `server.ts`
  - ✅ 加入詳細註解說明職責分離
  - ✅ 加入使用範例
- [x] 9.5 建立 `supabase/migrations/README.md`
  - ✅ Migration 說明
  - ✅ 使用指南

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

