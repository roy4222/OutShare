# OAuth Redirect URL 問題解決方案總結

## 🎯 問題描述

在 Cloudflare Workers 部署後，使用者登入成功後會被跳轉到 `http://localhost:3000/dashboard` 而不是生產環境的 `https://outshare.roy422.ggff.net/dashboard`。

## 🔍 根本原因

**環境變數被錯誤地硬編碼到建置輸出中**

1. `.env.local` 檔案中有 `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
2. Next.js 在建置時會讀取 `.env.local` 並將 `NEXT_PUBLIC_*` 變數的值**直接替換**到程式碼中
3. `.env.local` 的優先級高於 `wrangler.jsonc` 和其他配置
4. 即使 `wrangler.jsonc` 中設定了正確的生產環境 URL，建置時已經使用了 `.env.local` 的值

### Next.js 環境變數優先級

```
.env.local (最高優先級) 
  ↓
.env.production / .env.development
  ↓
.env
  ↓
wrangler.jsonc (僅在運行時有效，建置時無效)
```

## ✅ 解決方案

### 1. 移除 `.env.local` 中的 `NEXT_PUBLIC_SITE_URL`

**之前**：
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**修正後**：
```bash
# .env.local
# 不設定 NEXT_PUBLIC_SITE_URL，讓它從 wrangler.jsonc 或運行時環境讀取
```

### 2. 在 `wrangler.jsonc` 中設定生產環境 URL

```jsonc
{
  "vars": {
    "NEXT_PUBLIC_SITE_URL": "https://outshare.roy422.ggff.net"
  }
}
```

### 3. 更新 Auth Callback Handler

在 `app/auth/callback/route.ts` 中添加檢測邏輯和日誌：

```typescript
// 判斷是否為生產環境
const host = request.headers.get('host') || ''
const isProduction = host.includes('outshare.roy422.ggff.net') || host.includes('roy422roy.workers.dev')

// 優先使用環境變數
let origin: string
if (isProduction || process.env.NEXT_PUBLIC_SITE_URL) {
  origin = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`
} else {
  origin = requestUrl.origin
}

// 添加詳細日誌
console.log('OAuth Callback - Using origin:', origin)
console.log('OAuth Callback - Request host:', host)
console.log('OAuth Callback - NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
console.log('OAuth Callback - Is production:', isProduction)
```

### 4. 清除快取並重新部署

```bash
# 清除建置快取
rm -rf .next .open-next

# 重新建置並部署
npm run deploy
```

## 📊 驗證步驟

### 部署確認

檢查部署日誌中的環境變數綁定：

```
✅ env.NEXT_PUBLIC_SITE_URL ("https://outshare.roy422.ggff.net")
```

### 日誌確認

使用 `npx wrangler tail` 查看實時日誌：

```
✅ OAuth Callback - NEXT_PUBLIC_SITE_URL: https://outshare.roy422.ggff.net
✅ OAuth Callback - Using origin: https://outshare.roy422.ggff.net
✅ Login successful, redirecting to: /dashboard
```

### 功能測試

1. 清除瀏覽器 Cookies 和快取
2. 訪問 https://outshare.roy422.ggff.net
3. 點擊「使用 Google 帳號登入」
4. 完成 OAuth 流程
5. ✅ 確認跳轉到 `https://outshare.roy422.ggff.net/dashboard`

## 🎓 經驗教訓

### 1. Next.js 的 `NEXT_PUBLIC_*` 變數行為

- 這些變數在**建置時**會被替換成實際值
- 建置後無法通過環境變數修改
- 不同環境需要不同的建置

### 2. 環境變數優先級

- `.env.local` 用於本地開發，不應包含生產環境配置
- 生產環境配置應在部署平台設定（Cloudflare Dashboard 或 `wrangler.jsonc`）

### 3. 除錯技巧

- 使用 `console.log` 記錄關鍵變數值
- 使用 `wrangler tail` 查看實時日誌
- 檢查部署輸出中的環境變數綁定

### 4. 清除快取的重要性

- 修改環境變數後必須清除 `.next` 和 `.open-next` 目錄
- 否則會使用舊的建置快取

## 📁 修改的檔案

1. ✅ `app/auth/callback/route.ts` - 添加生產環境檢測和日誌
2. ✅ `app/page.tsx` - 使用當前 origin（已恢復原狀）
3. ✅ `.env.local` - 移除 `NEXT_PUBLIC_SITE_URL`
4. ✅ `.dev.vars` - 註解掉 `NEXT_PUBLIC_SITE_URL`
5. ✅ `wrangler.jsonc` - 確認生產環境 URL 設定正確
6. ✅ `docs/Issues/OAUTH_REDIRECT_FIX.md` - 建立故障排除文檔

## 🚀 最佳實踐建議

### 本地開發環境

```bash
# .env.local (僅用於本地開發)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# 不設定 NEXT_PUBLIC_SITE_URL，讓程式碼使用 requestUrl.origin
```

### 生產環境

```jsonc
// wrangler.jsonc
{
  "vars": {
    "NEXT_PUBLIC_SUPABASE_URL": "...",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "...",
    "NEXT_PUBLIC_SITE_URL": "https://your-production-domain.com"
  }
}
```

### 部署流程

```bash
# 1. 清除快取
rm -rf .next .open-next

# 2. 建置並部署
npm run deploy

# 3. 查看日誌
npx wrangler tail

# 4. 測試功能
# 清除瀏覽器快取 → 訪問網站 → 測試登入
```

## ✅ 問題已解決

- ✅ OAuth 登入後正確跳轉到生產環境 URL
- ✅ 環境變數配置清晰且正確
- ✅ 添加了詳細的日誌以便未來除錯
- ✅ 建立了完整的故障排除文檔

---

**修復完成日期**: 2025-10-19  
**測試狀態**: ✅ 通過  
**部署環境**: Cloudflare Workers  
**生產網址**: https://outshare.roy422.ggff.net

