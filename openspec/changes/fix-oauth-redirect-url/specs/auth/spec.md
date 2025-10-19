# OAuth Redirect URL 修復規格

## MODIFIED Requirements

### Requirement: OAuth Callback URL 處理
系統 SHALL 在所有部署環境中正確處理 OAuth callback 的 redirect URL，確保使用者登入後跳轉到正確的應用 URL 而非開發環境 URL。

#### Scenario: Cloudflare Workers 部署環境
- **WHEN** 使用者在 Cloudflare Workers 部署的應用中完成 Google OAuth 登入
- **AND** 環境變數 `NEXT_PUBLIC_SITE_URL` 已在 `wrangler.jsonc` 中設定為 `https://outshare.roy422.ggff.net`
- **THEN** 系統應將使用者跳轉到 `https://outshare.roy422.ggff.net/dashboard`
- **AND** 不應跳轉到 `http://localhost:3000/dashboard`

#### Scenario: 本地開發環境
- **WHEN** 使用者在本地開發環境完成 Google OAuth 登入
- **AND** 環境變數 `NEXT_PUBLIC_SITE_URL` 未設定或為空
- **THEN** 系統應使用 `requestUrl.origin` 作為 fallback
- **AND** 應正確跳轉到 `http://localhost:3000/dashboard`

#### Scenario: 環境變數讀取
- **WHEN** OAuth callback handler 執行時
- **THEN** 系統應優先從 `process.env.NEXT_PUBLIC_SITE_URL` 讀取 site URL
- **AND** 如果該環境變數不存在，則使用 `requestUrl.origin` 作為 fallback
- **AND** 應記錄使用的 origin 值以便除錯

## ADDED Requirements

### Requirement: 客戶端 OAuth Redirect URL 配置
客戶端 OAuth 初始化時 SHALL 使用環境變數配置 redirect URL，而非依賴瀏覽器的 `window.location.origin`。

#### Scenario: OAuth 登入初始化
- **WHEN** 使用者點擊 "使用 Google 帳號登入" 按鈕
- **AND** 系統執行 `signInWithOAuth` 
- **THEN** redirectTo 參數應使用 `process.env.NEXT_PUBLIC_SITE_URL` (如果可用) 加上 `/auth/callback`
- **AND** 如果環境變數不可用，則 fallback 到 `window.location.origin`

### Requirement: 環境變數驗證
系統部署到生產環境時 SHALL 驗證所有必要的環境變數已正確設定。

#### Scenario: 環境變數缺失警告
- **WHEN** 應用在非開發環境啟動
- **AND** `NEXT_PUBLIC_SITE_URL` 環境變數未設定
- **THEN** 系統應在伺服器日誌中記錄警告訊息
- **AND** 說明可能導致 OAuth redirect 問題

