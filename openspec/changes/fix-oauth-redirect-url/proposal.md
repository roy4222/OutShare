# 修復 OAuth Redirect URL 問題

## Why
當應用部署到 Cloudflare Workers 時，OAuth 登入成功後會跳轉到 `http://localhost:3000/dashboard` 而不是生產環境的 URL `https://outshare.roy422.ggff.net/dashboard`。這是因為環境變數 `NEXT_PUBLIC_SITE_URL` 沒有正確傳遞到運行時環境，導致系統使用了錯誤的 origin。

## What Changes
- 修改 `app/auth/callback/route.ts` 以確保在 Cloudflare Workers 環境中正確讀取 `NEXT_PUBLIC_SITE_URL`
- 更新 `app/page.tsx` 中的 OAuth redirectTo 邏輯，優先使用環境變數而非 `window.location.origin`
- 確保 `wrangler.jsonc` 中的環境變數配置正確

## Impact
- 影響的檔案: 
  - `app/auth/callback/route.ts`
  - `app/page.tsx`
  - `wrangler.jsonc`
- 影響的功能: Google OAuth 登入流程
- 無破壞性變更

