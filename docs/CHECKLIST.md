# ✅ Google 登入實作檢查清單

## 📦 已建立的檔案

### 核心功能檔案

- [x] `lib/supabase/client.ts` - 客戶端 Supabase 實例 (已更新)
- [x] `lib/supabase/server.ts` - 伺服器端 Supabase 實例
- [x] `lib/supabase/middleware.ts` - Middleware 用 Supabase 實例
- [x] `middleware.ts` - Next.js Middleware (Session 更新)
- [x] `app/page.tsx` - 首頁 (包含 Google 登入按鈕)
- [x] `app/auth/callback/route.ts` - OAuth callback 處理
- [x] `app/auth/auth-code-error/page.tsx` - OAuth 錯誤頁面
- [x] `app/dashboard/page.tsx` - 受保護的頁面範例
- [x] `components/AuthButton.tsx` - 認證按鈕組件

### 文件檔案

- [x] `QUICK_START.md` - 快速開始指南
- [x] `SETUP_GOOGLE_AUTH.md` - 完整設定指南
- [x] `README_GOOGLE_AUTH.md` - 功能說明文件
- [x] `CHECKLIST.md` - 本檔案

---

## 🔧 設定步驟

### 環境設定

- [ ] 已建立 `.env.local` 檔案
- [ ] 已填入 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 已填入 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 已填入 `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] 已重新啟動開發伺服器

### Google Cloud Console 設定

- [ ] 已建立 Google Cloud 專案
- [ ] 已設定 OAuth 同意畫面
  - [ ] 應用程式名稱已填寫
  - [ ] 使用者支援電子郵件已填寫
  - [ ] 已新增 `openid` 範圍
- [ ] 已建立 OAuth 客戶端 ID
  - [ ] 應用程式類型: 網頁應用程式
  - [ ] 已授權的 JavaScript 來源: `http://localhost:3000`
  - [ ] 已授權的重新導向 URI:
    - [ ] `http://localhost:3000/auth/callback`
    - [ ] `https://your-project-ref.supabase.co/auth/v1/callback`
- [ ] 已複製 Client ID
- [ ] 已複製 Client Secret

### Supabase Dashboard 設定

- [ ] 已啟用 Google Provider
  - [ ] Authentication → Providers → Google
  - [ ] Enable Sign in with Google 已開啟
  - [ ] Client ID 已填入
  - [ ] Client Secret 已填入
  - [ ] 已點擊 Save
- [ ] 已設定 Redirect URLs
  - [ ] Authentication → URL Configuration
  - [ ] 已新增 `http://localhost:3000/auth/callback`
  - [ ] 已點擊 Save

---

## 🧪 測試步驟

### 基本功能測試

- [ ] 開發伺服器已啟動 (`npm run dev`)
- [ ] 可以開啟首頁 `http://localhost:3000`
- [ ] 可以看到「使用 Google 帳號登入」按鈕
- [ ] 點擊按鈕後會重導向到 Google 登入頁面
- [ ] 選擇 Google 帳號後會要求授權
- [ ] 授權後會重導向回應用程式
- [ ] 瀏覽器 Console 沒有錯誤訊息

### 使用者狀態測試

- [ ] 登入後可以前往 `http://localhost:3000/dashboard`
- [ ] Dashboard 顯示使用者資訊:
  - [ ] 顯示使用者名稱
  - [ ] 顯示 Email
  - [ ] 顯示頭像 (如果有)
  - [ ] 顯示使用者 ID
  - [ ] 顯示上次登入時間
- [ ] 可以看到使用者的 metadata
- [ ] 點擊「登出」按鈕可以成功登出
- [ ] 登出後會重導向到首頁

### Session 持續性測試

- [ ] 登入後重新整理頁面，使用者狀態仍保持登入
- [ ] 關閉瀏覽器後重新開啟，使用者狀態仍保持登入 (如果 session 未過期)
- [ ] 在 Dashboard 重新整理頁面不會被踢回首頁

### 錯誤處理測試

- [ ] 如果 OAuth 流程失敗，會重導向到 `/auth/auth-code-error`
- [ ] 錯誤頁面有清楚的錯誤訊息
- [ ] 錯誤頁面有「返回首頁」按鈕

---

## 🔐 安全性檢查

- [ ] 環境變數使用 `NEXT_PUBLIC_` 前綴 (公開變數)
- [ ] `.env.local` 檔案已加入 `.gitignore` (不要提交到 Git)
- [ ] Client Secret 只儲存在 Supabase Dashboard，不在前端程式碼中
- [ ] Redirect URLs 只包含信任的網域
- [ ] 使用 PKCE flow (自動由 Supabase 處理)

---

## 📊 資料庫檢查 (選用)

如果你想要自動建立使用者 profile:

- [ ] 已建立 `profiles` 資料表
- [ ] 已啟用 Row Level Security (RLS)
- [ ] 已建立 RLS policies
- [ ] 已建立 `handle_new_user()` function
- [ ] 已建立 `on_auth_user_created` trigger
- [ ] 登入後可以在 Supabase Dashboard → Table Editor → profiles 看到新使用者

---

## 🎨 UI/UX 檢查

- [ ] 登入按鈕有明確的文字說明
- [ ] 登入按鈕有 Google icon
- [ ] 按鈕在點擊時顯示 loading 狀態
- [ ] 按鈕在 loading 時無法重複點擊
- [ ] Dashboard 有清楚的使用者資訊顯示
- [ ] 有明確的登出按鈕
- [ ] 錯誤訊息清楚易懂

---

## 📱 響應式設計檢查

- [ ] 在桌面瀏覽器顯示正常
- [ ] 在平板顯示正常
- [ ] 在手機顯示正常
- [ ] 登入按鈕在小螢幕上不會過寬或過窄

---

## 🚀 部署前檢查 (當準備部署到正式環境時)

### 環境變數

- [ ] 正式環境的 `.env.production` 已設定
- [ ] Vercel/其他平台的環境變數已設定

### Google Cloud Console

- [ ] 已授權的 JavaScript 來源包含正式環境網域
- [ ] 已授權的重新導向 URI 包含正式環境網域
- [ ] 例如: `https://your-domain.com/auth/callback`

### Supabase

- [ ] Redirect URLs 包含正式環境網域
- [ ] 例如: `https://your-domain.com/auth/callback`

### DNS & SSL

- [ ] 自訂網域的 DNS 已設定
- [ ] SSL 憑證已配置
- [ ] HTTPS 可正常運作

---

## 📝 文件檢查

- [ ] 已閱讀 `QUICK_START.md`
- [ ] 已閱讀 `SETUP_GOOGLE_AUTH.md`
- [ ] 已閱讀 `README_GOOGLE_AUTH.md`
- [ ] 團隊成員了解如何設定和使用 Google 登入

---

## 🎯 進階功能 (選用)

- [ ] 實作其他 OAuth providers (Facebook, GitHub, 等)
- [ ] 自訂登入後的 redirect 邏輯
- [ ] 整合 Google API (Drive, Calendar, 等)
- [ ] 實作 email + password 登入作為備選方案
- [ ] 實作「記住我」功能
- [ ] 實作帳號連結 (link multiple providers)
- [ ] 實作使用者權限管理 (roles & permissions)

---

## ✨ 最終確認

- [ ] 所有核心功能正常運作
- [ ] 沒有 console 錯誤或警告
- [ ] 程式碼已經過 linting 檢查
- [ ] 程式碼有適當的註解
- [ ] 已測試主要使用情境
- [ ] 已準備好 demo 給團隊看

---

## 📞 需要協助？

如果遇到任何問題:

1. 📖 先檢查文件:
   - `QUICK_START.md` - 快速開始
   - `SETUP_GOOGLE_AUTH.md` - 完整設定
   - `README_GOOGLE_AUTH.md` - 功能說明

2. 🔍 檢查 Logs:
   - 瀏覽器 Console (F12)
   - Supabase Dashboard → Logs → Auth Logs
   - Next.js 開發伺服器輸出

3. 🌐 參考官方文檔:
   - [Supabase Auth 文檔](https://supabase.com/docs/guides/auth)
   - [Google OAuth 文檔](https://developers.google.com/identity/protocols/oauth2)

4. 💬 尋求社群協助:
   - [Supabase Discord](https://discord.supabase.com/)
   - [Next.js Discord](https://nextjs.org/discord)

---

**🎉 祝你設定順利！**

