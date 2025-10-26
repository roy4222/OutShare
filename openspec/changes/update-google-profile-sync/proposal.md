# 修復 Google OAuth Profile 同步

## Why
- 目前使用 Google 登入時只建立 `auth.users` 記錄，`profiles` 表並未同步建立，導致需要 Profile 的 API（例如 `/api/profiles`、儀表板頁面）回傳 404 或 500。
- 使用者第一次登入後立即進入個人化流程，但因為缺少 Profile 資料而卡在錯誤頁面，整個入門體驗中斷。
- 專案假設 Supabase 會透過 Trigger 自動建立 Profile，實際部署在 Cloudflare/Supabase 的組合下並未生效，需要在應用程式層處理。

## What Changes
- 在 OAuth callback（`app/auth/callback/route.ts`）中加入 Profile 同步流程：取得登入使用者資訊，確認 Profile 是否存在，若缺失則以 Prisma 建立預設資料。
- 擴充 `lib/services/prisma/profiles.service.ts`，提供 `ensureProfileForUser` 或等效的 upsert helper，將 Google metadata（`full_name`、`avatar_url`）轉換成 Profile 欄位。
- 記錄同步流程中的例外情況並回報至伺服器日誌，必要時回傳明確的錯誤頁面（避免重新導向後才發現 Profile 缺失）。
- 覆核 `profiles` 欄位的預設值（例如 `social_links` 空物件、`gear_dashboard_title` 預設文字），確保新建立的 Profile 符合前端預期。

## Impact
- 受影響檔案：
  - `app/auth/callback/route.ts`
  - `lib/services/prisma/profiles.service.ts`
  - （視需要）`lib/mappers/profile.ts` 或新增的 mapping helper
- 受影響功能：Google OAuth 登入流程、Profile 相關 API 與 Dashboard 初始體驗
- 無資料庫 schema 變更，但需重新驗證登入流程及首登個人化流程
