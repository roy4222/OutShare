# Google 登入設定指南

這份文件將引導你完成 Google OAuth 登入的完整設定流程。

## 📋 目錄

1. [先決條件](#先決條件)
2. [Google Cloud 設定](#google-cloud-設定)
3. [Supabase 設定](#supabase-設定)
4. [本地環境設定](#本地環境設定)
5. [測試 Google 登入](#測試-google-登入)
6. [常見問題](#常見問題)

---

## 先決條件

在開始之前，請確保你已經:

- ✅ 有一個 Google 帳號
- ✅ 已建立 Supabase 專案
- ✅ 已安裝所需的依賴套件

如果尚未安裝依賴套件，請執行:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Google Cloud 設定

### 步驟 1: 建立 Google Cloud 專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 點擊頂部的專案選擇器，然後點擊「新增專案」
3. 輸入專案名稱（例如: `outdoor-trails-hub`）
4. 點擊「建立」

### 步驟 2: 啟用 Google+ API

1. 在左側選單中，點擊「API 和服務」→「資料庫」
2. 搜尋「Google+ API」
3. 點擊「啟用」

### 步驟 3: 設定 OAuth 同意畫面

1. 在左側選單中，點擊「OAuth 同意畫面」
2. 選擇「外部」(External) 使用者類型
3. 填寫必要資訊:
   - **應用程式名稱**: `Outdoor Trails Hub`
   - **使用者支援電子郵件**: 你的 email
   - **開發人員聯絡資訊**: 你的 email
4. 點擊「儲存並繼續」

### 步驟 4: 設定範圍 (Scopes)

1. 點擊「新增或移除範圍」
2. 選擇以下範圍:
   - `openid`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
3. 點擊「更新」
4. 點擊「儲存並繼續」

### 步驟 5: 建立 OAuth 2.0 客戶端 ID

1. 在左側選單中，點擊「憑證」
2. 點擊「建立憑證」→「OAuth 客戶端 ID」
3. 選擇應用程式類型: **網頁應用程式**
4. 填寫資訊:
   - **名稱**: `Outdoor Trails Hub Web Client`
   
   - **已授權的 JavaScript 來源**:
     ```
     http://localhost:3000
     https://your-domain.com
     ```
   
   - **已授權的重新導向 URI**:
     ```
     http://localhost:3000/auth/callback
     https://<your-project-ref>.supabase.co/auth/v1/callback
     https://your-domain.com/auth/callback
     ```
     
     > 💡 **重要**: 將 `<your-project-ref>` 替換為你的 Supabase 專案 ID，
     > 可以在 Supabase Dashboard → Settings → API 找到

5. 點擊「建立」
6. **複製並保存** Client ID 和 Client Secret

---

## Supabase 設定

### 步驟 1: 啟用 Google Provider

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的專案
3. 在左側選單中，點擊「Authentication」→「Providers」
4. 找到「Google」並點擊
5. 啟用「Enable Sign in with Google」
6. 填入從 Google Cloud Console 獲得的:
   - **Client ID**: 你的 Google Client ID
   - **Client Secret**: 你的 Google Client Secret
7. 點擊「Save」

### 步驟 2: 設定 Redirect URLs

1. 在 Supabase Dashboard，前往「Authentication」→「URL Configuration」
2. 在「Redirect URLs」中，添加以下 URL:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```
3. 點擊「Save」

---

## 本地環境設定

### 步驟 1: 建立環境變數檔案

在專案根目錄建立 `.env.local` 檔案:

```bash
# .env.local

# Supabase 設定
# 從 Supabase Dashboard → Settings → API 獲取
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth 設定
# 從 Google Cloud Console → 憑證 獲取
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 步驟 2: 獲取 Supabase 憑證

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的專案
3. 點擊左側選單的「Settings」→「API」
4. 複製以下資訊:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 步驟 3: 重啟開發伺服器

```bash
npm run dev
```

---

## 測試 Google 登入

### 測試流程

1. 開啟瀏覽器，前往 `http://localhost:3000`
2. 點擊「使用 Google 帳號登入」按鈕
3. 你應該會被重導向到 Google 登入頁面
4. 選擇你的 Google 帳號並授權
5. 登入成功後，你會被重導向回應用程式
6. 前往 `http://localhost:3000/dashboard` 查看使用者資訊

### 驗證登入狀態

開啟瀏覽器的開發者工具 (F12)，執行:

```javascript
// 在 Console 中執行
const { createClient } = await import('./lib/supabase/client')
const supabase = createClient()
const { data } = await supabase.auth.getUser()
console.log(data.user)
```

如果看到使用者資訊，表示登入成功！

---

## 常見問題

### Q1: 按下登入按鈕後沒有反應？

**檢查清單**:
- ✅ 確認環境變數已正確設定
- ✅ 確認已重啟開發伺服器
- ✅ 開啟瀏覽器 Console 查看是否有錯誤訊息
- ✅ 確認 Supabase 專案的 Google Provider 已啟用

### Q2: 重導向失敗或顯示 400 錯誤？

**可能原因**:
1. **Redirect URI 不符**:
   - 檢查 Google Cloud Console 中的「已授權的重新導向 URI」
   - 檢查 Supabase Dashboard 中的「Redirect URLs」
   - 確保兩者都包含 `http://localhost:3000/auth/callback`

2. **Client ID 或 Secret 錯誤**:
   - 重新檢查 Supabase Dashboard 中的設定
   - 確認沒有多餘的空格或換行

### Q3: 登入後無法取得使用者資訊？

**解決方法**:
1. 清除瀏覽器 cookies 和 localStorage
2. 登出後重新登入
3. 檢查 Supabase Dashboard → Authentication → Users 確認使用者已建立

### Q4: 開發環境可以，正式環境不行？

**檢查項目**:
1. 確認正式環境的 domain 已加入:
   - Google Cloud Console → 已授權的 JavaScript 來源
   - Google Cloud Console → 已授權的重新導向 URI
   - Supabase → Redirect URLs

2. 確認環境變數在正式環境中已正確設定

### Q5: "Error: redirect_uri_mismatch" 錯誤？

這表示 redirect URI 不符合 Google Cloud Console 的設定。

**解決步驟**:
1. 複製錯誤訊息中顯示的 redirect URI
2. 前往 Google Cloud Console → 憑證 → 你的 OAuth 客戶端
3. 在「已授權的重新導向 URI」中加入該 URI
4. 儲存並等待幾分鐘讓變更生效

---

## 🎉 完成！

現在你的應用程式已經成功整合 Google 登入功能！

### 下一步

- 📝 自訂登入後的重導向頁面
- 🔒 為特定路由添加身份驗證保護
- 👤 建立使用者個人資料頁面
- 📊 記錄使用者活動和分析

### 相關文件

- [Supabase Auth 官方文檔](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 文檔](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication 最佳實踐](https://nextjs.org/docs/authentication)

---

## 📞 需要協助？

如果遇到任何問題，可以:
- 查看 Supabase Dashboard → Logs 中的錯誤日誌
- 檢查瀏覽器 Console 的錯誤訊息
- 參考 [Supabase Discord 社群](https://discord.supabase.com/)

