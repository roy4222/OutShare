# 實作任務

## 1. 分析問題
- [x] 1.1 檢查 `app/auth/callback/route.ts` 中的 origin 邏輯
- [x] 1.2 檢查 `app/page.tsx` 中的 OAuth redirectTo 設定
- [x] 1.3 檢查 `wrangler.jsonc` 中的環境變數配置

## 2. 修復 Auth Callback Handler
- [x] 2.1 更新 `app/auth/callback/route.ts` 確保正確讀取環境變數
- [x] 2.2 添加環境變數的 fallback 邏輯
- [x] 2.3 添加日誌輸出以便除錯

## 3. 修復 OAuth 登入流程
- [x] 3.1 更新 `app/page.tsx` 中的 redirectTo 使用環境變數
- [x] 3.2 確保客戶端能正確讀取 `NEXT_PUBLIC_SITE_URL`

## 4. 驗證與測試
- [x] 4.1 本地開發環境測試登入流程
- [x] 4.2 部署到 Cloudflare Workers 並測試
- [x] 4.3 確認跳轉 URL 正確
- [x] 4.4 確認 Supabase Dashboard 的 Redirect URLs 設定正確

## 5. 文檔更新
- [x] 5.1 更新部署文檔說明環境變數的重要性
- [x] 5.2 添加故障排除指南

