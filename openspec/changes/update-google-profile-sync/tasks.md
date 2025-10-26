# Implementation Tasks

## 1. 登入流程分析與驗證
- [ ] 1.1 使用 Google OAuth 在本地與 Cloudflare 開發環境驗證目前 `profiles` 表未建立的行為（待手動測試）
- [x] 1.2 追蹤 `app/auth/callback/route.ts` 現行流程，確認可取得使用者資訊與 session
- [x] 1.3 盤點 Profile 欄位預期預設值（`display_name`、`avatar_url`、`social_links`、`gear_dashboard_title`）

## 2. Profile 同步邏輯實作
- [x] 2.1 在 `lib/services/prisma/profiles.service.ts` 新增 `ensureProfileForUser`（或等效函式）以 Prisma upsert Profile
- [x] 2.2 實作將 Supabase `user.user_metadata` 映射到 Profile 欄位的 helper（必要時更新 `lib/mappers/profile.ts`）
- [x] 2.3 處理缺失資料的 fallback（例如 `full_name` 缺失時改用 `email` 或 `user.user_metadata.name`）
- [x] 2.4 保留既有 Profile 的客製化欄位（例如使用者已編輯的 `username`、`bio` 不應被覆蓋）

## 3. OAuth Callback 整合
- [x] 3.1 在 `app/auth/callback/route.ts` 交換 session 成功後呼叫 Profile 同步 helper
- [x] 3.2 若同步失敗，記錄錯誤並導向專用錯誤頁或顯示提示，避免導向空白 Dashboard
- [ ] 3.3 針對 Cloudflare/Supabase 組合測試同步時序，確保 redirect 發生前已建立 Profile（待部署環境驗證）

## 4. 測試與驗證
- [ ] 4.1 本地執行 Google OAuth 首次登入，確認 `profiles` 表建立且資料正確（待手動測試）
- [ ] 4.2 重複登入驗證：Profile 已存在時不應覆寫使用者自訂欄位（待手動測試）
- [ ] 4.3 執行 `npm run build` 確保無型別或 lint 錯誤（`npm run lint` 受 .open-next 輸出影響失敗，需另行處理）
- [ ] 4.4 更新手動驗證紀錄：記載首次登入、重複登入的觀察結果（待測試後補）
