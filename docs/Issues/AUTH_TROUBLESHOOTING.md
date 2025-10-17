# 🔧 Google 登入問題排除指南

## 問題: 登入後顯示「登入發生錯誤」頁面

### 已修復的問題 ✅

1. **缺少 `app/auth/callback/route.ts` 檔案** - 已建立
2. **缺少根目錄 `middleware.ts` 檔案** - 已建立
3. **錯誤頁面缺少返回按鈕** - 已添加

---

## 檢查清單

請按照以下步驟檢查你的設定：

### ✅ 1. 確認環境變數設定

檢查根目錄是否有 `.env.local` 檔案，並包含以下內容：

```env
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Google OAuth 設定 (可選，Supabase 會自動處理)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

**檢查方式**:
```bash
# 在專案根目錄執行
cat .env.local  # Mac/Linux
type .env.local # Windows
```

---

### ✅ 2. 確認 Supabase 設定

#### 2.1 檢查 Google Provider 是否啟用

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的專案
3. 左側選單 → **Authentication** → **Providers**
4. 找到 **Google** 並確認:
   - ✅ **Enable Sign in with Google** 已開啟
   - ✅ **Client ID** 已填入
   - ✅ **Client Secret** 已填入

#### 2.2 檢查 Redirect URLs 設定

1. 在 Supabase Dashboard
2. 左側選單 → **Authentication** → **URL Configuration**
3. 在 **Redirect URLs** 中確認包含:
   ```
   http://localhost:3000/auth/callback
   ```

---

### ✅ 3. 確認 Google Cloud 設定

#### 3.1 檢查 OAuth 客戶端 ID

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇你的專案
3. 左側選單 → **API 和服務** → **憑證**
4. 點擊你的 OAuth 2.0 客戶端
5. 確認以下設定:

**已授權的 JavaScript 來源**:
```
http://localhost:3000
```

**已授權的重新導向 URI** (必須包含這兩個):
```
http://localhost:3000/auth/callback
https://你的專案ID.supabase.co/auth/v1/callback
```

#### 3.2 取得 Supabase 專案 ID

在 Supabase Dashboard 的 URL 中可以看到:
```
https://supabase.com/dashboard/project/你的專案ID
```

或從 Project URL 取得:
```
https://你的專案ID.supabase.co
```

---

### ✅ 4. 重啟開發伺服器

修改環境變數或配置檔案後，**必須重啟開發伺服器**：

```bash
# 停止當前的開發伺服器 (Ctrl+C)
# 然後重新啟動
npm run dev
```

---

### ✅ 5. 清除瀏覽器快取

有時候舊的 session 資料會造成問題：

#### Chrome / Edge
1. 按 F12 開啟開發者工具
2. 右鍵點擊重新整理按鈕
3. 選擇「清除快取並強制重新整理」

#### 或直接清除 Cookies
1. 按 F12 開啟開發者工具
2. 前往 **Application** 標籤
3. 左側 **Storage** → **Cookies**
4. 刪除 `localhost:3000` 的所有 cookies

---

### ✅ 6. 測試登入流程

1. 開啟 **新的無痕/隱私視窗**
2. 前往 `http://localhost:3000`
3. 點擊「使用 Google 帳號登入」
4. 選擇你的 Google 帳號並授權
5. 應該會成功跳轉到 `/dashboard`

---

## 🐛 除錯技巧

### 檢查伺服器端的錯誤訊息

當登入失敗時，查看開發伺服器的終端機輸出：

```bash
# 你應該會看到類似這樣的輸出
Exchange code error: { message: "...", ... }
```

常見的錯誤訊息：

| 錯誤訊息 | 原因 | 解決方法 |
|---------|------|---------|
| `invalid_grant` | 授權碼已過期或已使用 | 重新登入 |
| `redirect_uri_mismatch` | Redirect URI 不符 | 檢查 Google Cloud Console 的設定 |
| `invalid_client` | Client ID 或 Secret 錯誤 | 檢查 Supabase 的 Google Provider 設定 |
| `unauthorized_client` | Google OAuth 尚未完全設定 | 確認 OAuth 同意畫面已發布 |

### 檢查瀏覽器 Console

1. 按 F12 開啟開發者工具
2. 前往 **Console** 標籤
3. 查看是否有紅色的錯誤訊息

### 檢查 Network 請求

1. 按 F12 開啟開發者工具
2. 前往 **Network** 標籤
3. 點擊登入按鈕
4. 查看是否有失敗的請求（紅色標記）
5. 點擊失敗的請求查看詳細資訊

---

## 📋 完整檢查清單

請逐項檢查：

- [ ] `.env.local` 檔案存在且包含正確的 Supabase URL 和 ANON_KEY
- [ ] Supabase Google Provider 已啟用並填入 Client ID 和 Secret
- [ ] Supabase Redirect URLs 包含 `http://localhost:3000/auth/callback`
- [ ] Google Cloud OAuth 客戶端的 Redirect URI 包含兩個 URL
- [ ] Google Cloud OAuth 同意畫面已設定並發布
- [ ] 已重啟開發伺服器
- [ ] 已清除瀏覽器快取和 cookies
- [ ] `app/auth/callback/route.ts` 檔案存在
- [ ] 根目錄 `middleware.ts` 檔案存在

---

## 💡 快速測試

在瀏覽器 Console 執行以下程式碼來測試 Supabase 連線：

```javascript
// 測試 Supabase 連線
fetch('https://你的專案ID.supabase.co/rest/v1/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

如果連線正常，應該會看到 API 的回應。

---

## 🆘 仍然無法登入？

如果按照以上步驟仍然無法解決問題，請提供以下資訊：

1. **終端機的錯誤訊息**（完整的 log）
2. **瀏覽器 Console 的錯誤訊息**
3. **Network 請求的截圖**（特別是失敗的請求）
4. **Supabase Auth Logs**（在 Supabase Dashboard → Logs → Auth Logs）

---

## ✅ 成功登入的標誌

當一切設定正確時，你會看到：

1. 點擊登入按鈕後，跳轉到 Google 登入頁面
2. 選擇帳號並授權
3. 自動跳轉回應用程式的 `/dashboard` 頁面
4. 在 dashboard 看到你的 Google 帳號資訊（名稱、Email、頭像）

---

**祝登入順利！** 🎉

