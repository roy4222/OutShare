# OAuth Redirect URL 修復指南

## 問題描述

當應用部署到 Cloudflare Workers 時，使用者在 Google OAuth 登入成功後，會被跳轉到 `http://localhost:3000/dashboard` 而不是生產環境的 URL（例如 `https://outshare.roy422.ggff.net/dashboard`）。

## 根本原因

1. **環境變數未正確傳遞**: 雖然 `wrangler.jsonc` 中設定了 `NEXT_PUBLIC_SITE_URL`，但在某些情況下這個環境變數可能無法正確傳遞到 Next.js 運行時。

2. **客戶端依賴瀏覽器 origin**: 在 `app/page.tsx` 中，OAuth 的 `redirectTo` 使用了 `window.location.origin`，這在客戶端執行時會是瀏覽器當前的 URL origin。

3. **Callback handler 的 fallback 邏輯**: `app/auth/callback/route.ts` 中使用 `requestUrl.origin` 作為 fallback，可能在某些情況下會返回錯誤的 origin。

## 解決方案

### 1. 更新 Auth Callback Handler

在 `app/auth/callback/route.ts` 中：

```typescript
// 優先使用環境變數 NEXT_PUBLIC_SITE_URL (生產環境)
// Fallback 到請求的 origin (本地開發環境)
let origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

// 在 WSL 本地開發環境中，origin 可能是 0.0.0.0，需要轉換成 localhost
if (origin.includes('0.0.0.0')) {
  origin = origin.replace('0.0.0.0', 'localhost')
}

// 記錄使用的 origin，方便除錯
console.log('OAuth Callback - Using origin:', origin)
console.log('OAuth Callback - NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
console.log('OAuth Callback - Request origin:', requestUrl.origin)
```

### 2. 更新 OAuth 登入流程

在 `app/page.tsx` 中：

```typescript
const handleGoogleSignIn = async () => {
  try {
    setIsLoading(true);
    
    // 使用環境變數或 fallback 到當前 origin
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    // ...
  }
}
```

### 3. 確認環境變數配置

在 `wrangler.jsonc` 中確認：

```json
{
  "vars": {
    "NEXT_PUBLIC_SITE_URL": "https://outshare.roy422.ggff.net"
  }
}
```

## 驗證步驟

### 本地測試

1. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

2. 訪問 `http://localhost:3000`
3. 點擊 "使用 Google 帳號登入"
4. 完成 OAuth 流程
5. 確認跳轉到 `http://localhost:3000/dashboard`

### 生產環境測試

1. 建置並部署到 Cloudflare Workers：
   ```bash
   npm run deploy
   ```

2. 訪問生產環境 URL（例如 `https://outshare.roy422.ggff.net`）
3. 點擊 "使用 Google 帳號登入"
4. 完成 OAuth 流程
5. 確認跳轉到 `https://outshare.roy422.ggff.net/dashboard`（而非 localhost）

### 檢查日誌

部署後，使用以下命令查看日誌：

```bash
npx wrangler tail
```

然後執行登入流程，你應該會看到類似以下的日誌：

```
OAuth Callback - Using origin: https://outshare.roy422.ggff.net
OAuth Callback - NEXT_PUBLIC_SITE_URL: https://outshare.roy422.ggff.net
OAuth Callback - Request origin: https://outshare.roy422.ggff.net
Login successful, redirecting to: /dashboard
```

## Supabase 設定

確保在 Supabase Dashboard 中添加了正確的 Redirect URLs：

1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 選擇你的專案
3. 進入 **Authentication** → **URL Configuration**
4. 在 **Redirect URLs** 中添加：
   - `http://localhost:3000/auth/callback`（本地開發）
   - `https://outshare.roy422.ggff.net/auth/callback`（生產環境）

## 故障排除

### 問題 1: 仍然跳轉到 localhost

**檢查項目**:
1. 確認 `wrangler.jsonc` 中的 `NEXT_PUBLIC_SITE_URL` 設定正確
2. 確認已重新建置和部署應用
3. 檢查 Cloudflare Workers 的環境變數是否正確設定
4. 清除瀏覽器快取和 cookies

**解決方案**:
```bash
# 清除建置快取
rm -rf .next .open-next

# 重新建置並部署
npm run deploy
```

### 問題 2: 環境變數為 undefined

如果日誌顯示 `NEXT_PUBLIC_SITE_URL: undefined`：

1. 檢查 `wrangler.jsonc` 的語法是否正確（注意 JSON 格式）
2. 確認變數名稱拼寫正確（區分大小寫）
3. 嘗試在 Cloudflare Dashboard 中手動設定環境變數：
   - 進入 Workers & Pages
   - 選擇你的 worker
   - Settings → Variables
   - 添加環境變數

### 問題 3: OAuth 錯誤 "redirect_uri_mismatch"

這表示 Supabase 的 Redirect URLs 設定不正確：

1. 前往 Supabase Dashboard
2. 確認 Redirect URLs 包含你使用的所有網址
3. 注意 URL 必須完全匹配（包括 http/https 和路徑）

## 相關文檔

- [Cloudflare Workers 部署指南](./CLOUDFLARE_WORKERS_DEPLOYMENT.md)
- [Supabase 認證設定](./SETUP_GOOGLE_AUTH.md)
- [環境變數配置](../README.md)

## 變更記錄

- **2025-10-19**: 修復 OAuth redirect URL 問題，添加環境變數日誌

