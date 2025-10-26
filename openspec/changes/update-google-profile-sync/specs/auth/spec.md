# Google OAuth Profile 同步規格

## ADDED Requirements

### Requirement: Profile 初始化
系統 SHALL 在使用者透過 Google OAuth 首次登入後，於 `profiles` 表建立對應的 Profile 紀錄，以支援後續的個人化功能。

#### Scenario: 首次登入缺少 Profile
- **WHEN** Supabase 回傳的登入使用者在 `profiles` 表中不存在
- **AND** OAuth callback 成功交換 session
- **THEN** 系統應立即以該使用者的 `user_id` 建立一筆 Profile
- **AND** 預設 `social_links` 為空物件、`gear_dashboard_title` 為預設文案（例如「我的裝備牆」）
- **AND** 建立成功後才進行登入後的 redirect

#### Scenario: Profile 已存在
- **WHEN** 使用者再次透過 Google OAuth 登入
- **AND** `profiles` 表已有該使用者的紀錄
- **THEN** 系統不應重複建立或覆寫既有 Profile 的 `username`、`bio` 等使用者自訂欄位
- **AND** 僅在缺失欄位（例如 `display_name` 或 `avatar_url` 為空）時進行補齊

### Requirement: Google Metadata 映射
系統 SHALL 將 Supabase 登入資訊中的 Google metadata 轉換為 Profile 預設欄位值，以提供一致的個人資料體驗。

#### Scenario: 取得顯示名稱
- **WHEN** OAuth callback 取得 `user.user_metadata.full_name`
- **THEN** Profile 的 `display_name` 應填入 `full_name`
- **AND** 若 `full_name` 缺失，則 fallback 為 `user.user_metadata.name`，仍缺失時使用 `user.email`

#### Scenario: 取得頭像
- **WHEN** OAuth callback 取得 `user.user_metadata.avatar_url` 或 `user.user_metadata.picture`
- **THEN** Profile 的 `avatar_url` 應設定為對應的 URL
- **AND** 若 metadata 無頭像，保留現有值或設定為 `null`

### Requirement: 同步錯誤處理
系統 SHALL 在 Profile 同步失敗時提供明確的錯誤處理流程，避免使用者進入缺資料的狀態。

#### Scenario: Profile 建立失敗
- **WHEN** Prisma upsert Profile 時發生錯誤（例如資料庫連線失敗）
- **THEN** 系統應記錄錯誤細節至伺服器日誌
- **AND** 導向專用錯誤頁面或回傳 500 錯誤響應，說明 Profile 建立失敗
- **AND** 不應繼續將使用者導向 Dashboard 或 Profile 編輯頁面
