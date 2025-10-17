# 🚀 Google 登入快速開始指南

## ⏱️ 5 分鐘快速設定

### 步驟 1: 建立 `.env.local` 檔案

在專案根目錄建立 `.env.local` 檔案並填入以下內容:

```env
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth 設定
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

### 步驟 2: 取得 Supabase 憑證

1. 前往 https://supabase.com/dashboard
2. 選擇你的專案
3. 左側選單 → **Settings** → **API**
4. 複製以下資訊:
   - **Project URL** → 貼到 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → 貼到 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 步驟 3: 設定 Google OAuth

#### 3.1 建立 Google Cloud 專案

1. 前往 https://console.cloud.google.com/
2. 建立新專案或選擇現有專案
3. 專案名稱: `Outdoor Trails Hub` (或任何你想要的名稱)

#### 3.2 設定 OAuth 同意畫面

1. 左側選單 → **API 和服務** → **OAuth 同意畫面**
2. 使用者類型: 選擇 **外部 (External)**
3. 填寫:
   - 應用程式名稱: `Outdoor Trails Hub`
   - 使用者支援電子郵件: 你的 email
   - 開發人員聯絡資訊: 你的 email
4. 範圍 (Scopes): 手動新增 `openid` (其他兩個已自動加入)
5. 儲存

#### 3.3 建立 OAuth 客戶端 ID

1. 左側選單 → **API 和服務** → **憑證**
2. 點擊 **建立憑證** → **OAuth 客戶端 ID**
3. 應用程式類型: **網頁應用程式**
4. 名稱: `Web Client`
5. **已授權的 JavaScript 來源**:
   ```
   http://localhost:3000
   ```
6. **已授權的重新導向 URI**:
   ```
   http://localhost:3000/auth/callback
   ```
   
   **重要**: 你還需要加入 Supabase 的 callback URL:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   
   將 `your-project-ref` 替換為你的 Supabase 專案 ID (可在 Supabase URL 中找到)

7. 點擊 **建立**
8. **複製 Client ID** → 貼到 `.env.local` 的 `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
9. **複製 Client Secret** (下一步會用到)

---

### 步驟 4: 在 Supabase 啟用 Google Provider

1. 前往 https://supabase.com/dashboard
2. 選擇你的專案
3. 左側選單 → **Authentication** → **Providers**
4. 找到 **Google** 並點擊
5. 開啟 **Enable Sign in with Google**
6. 填入:
   - **Client ID**: 從步驟 3.3 複製的 Client ID
   - **Client Secret**: 從步驟 3.3 複製的 Client Secret
7. 點擊 **Save**

#### 4.1 設定 Redirect URLs

1. 在 Supabase Dashboard，左側選單 → **Authentication** → **URL Configuration**
2. 在 **Redirect URLs** 區塊，新增:
   ```
   http://localhost:3000/auth/callback
   ```
3. 點擊 **Save**

---

### 步驟 5: 啟動應用程式

```bash
# 安裝依賴 (如果尚未安裝)
npm install

# 啟動開發伺服器
npm run dev
```

---

### 步驟 6: 測試登入

1. 開啟瀏覽器，前往 http://localhost:3000
2. 點擊「使用 Google 帳號登入」
3. 選擇你的 Google 帳號
4. 授權應用程式
5. 登入成功！

#### 測試登入狀態

- 前往 http://localhost:3000/dashboard 查看使用者資訊
- 如果看到你的 Google 帳號資訊，表示設定成功！

---

## ✅ 完成檢查清單

- [ ] `.env.local` 檔案已建立並填入正確的值
- [ ] Supabase 專案已建立並取得憑證
- [ ] Google Cloud 專案已建立
- [ ] OAuth 同意畫面已設定
- [ ] OAuth 客戶端 ID 已建立
- [ ] Supabase 中的 Google Provider 已啟用
- [ ] Redirect URLs 已正確設定 (Google & Supabase)
- [ ] 開發伺服器已啟動
- [ ] 可以成功點擊登入按鈕並完成 Google 登入流程

---

## 🐛 遇到問題？

### 常見錯誤 1: "redirect_uri_mismatch"

**解決方法**:
1. 檢查 Google Cloud Console → 憑證 → 已授權的重新導向 URI
2. 確認包含 `http://localhost:3000/auth/callback`
3. 確認包含 `https://your-project-ref.supabase.co/auth/v1/callback`

### 常見錯誤 2: 環境變數讀取不到

**解決方法**:
1. 確認 `.env.local` 檔案在專案根目錄
2. 重新啟動開發伺服器 (`Ctrl+C` 然後再次執行 `npm run dev`)
3. 檢查是否有拼字錯誤 (必須是 `NEXT_PUBLIC_` 開頭)

### 常見錯誤 3: 點擊登入按鈕沒反應

**解決方法**:
1. 開啟瀏覽器 Console (F12)
2. 查看是否有錯誤訊息
3. 確認 Supabase URL 和 ANON KEY 正確
4. 確認 Google Provider 在 Supabase 中已啟用

---

## 📚 更多資訊

- **完整設定指南**: 參考 [SETUP_GOOGLE_AUTH.md](./SETUP_GOOGLE_AUTH.md)
- **功能說明**: 參考 [README_GOOGLE_AUTH.md](./README_GOOGLE_AUTH.md)
- **Supabase 官方文檔**: https://supabase.com/docs/guides/auth/social-login/auth-google

---

## 🎉 下一步

現在你已經成功設定 Google 登入，可以:

1. 📝 自訂 `/dashboard` 頁面顯示更多使用者資訊
2. 🔒 為其他頁面添加身份驗證保護
3. 💾 將使用者資料儲存到 `profiles` 資料表
4. 🎨 美化登入頁面和使用者體驗

**開始探索吧！** 🚀

