# Gear Management Capability

## ADDED Requirements

### Requirement: Custom Dashboard Title

使用者 MUST 能夠自訂 Gear Dashboard 頁面的標題，並且該標題 SHALL 儲存至 Supabase 資料庫，以便在不同裝置與瀏覽器中保持一致。

#### Scenario: 使用者首次開啟 Gear Dashboard

- **WHEN** 使用者首次進入 Gear Dashboard 頁面
- **AND** 尚未設定自訂標題
- **THEN** 系統 SHALL 顯示預設標題「裝備管理」
- **AND** 標題旁邊 SHALL 顯示編輯圖示（SquarePenIcon）

#### Scenario: 使用者點擊編輯圖示開啟彈窗

- **WHEN** 使用者點擊標題旁的 SquarePenIcon
- **THEN** 系統 SHALL 開啟編輯彈窗（Dialog）
- **AND** 彈窗 SHALL 包含以下元素：
  - 標題文字「編輯」
  - 說明文字「此處能更改前台『我的裝備』頁籤名稱。」
  - 輸入框（預設值為當前標題）
  - 「取消」按鈕
  - 「儲存」按鈕

#### Scenario: 使用者編輯並儲存標題

- **WHEN** 使用者在彈窗輸入框中輸入新標題（例如「租借裝備」）
- **AND** 點擊「儲存」按鈕
- **THEN** 系統 SHALL 將新標題儲存至 Supabase `gear` 表的 `dashboard_title` 欄位
- **AND** 彈窗 SHALL 關閉
- **AND** 頁面標題 SHALL 立即更新為新標題
- **AND** 系統 SHALL 顯示成功提示訊息

#### Scenario: 使用者取消編輯

- **WHEN** 使用者在彈窗中修改標題
- **AND** 點擊「取消」按鈕或關閉彈窗
- **THEN** 系統 SHALL 關閉彈窗
- **AND** 標題 SHALL 保持原狀（不儲存變更）

#### Scenario: 標題驗證失敗

- **WHEN** 使用者在輸入框中輸入空白字串或超過 50 字元的標題
- **AND** 點擊「儲存」按鈕
- **THEN** 系統 SHALL 顯示驗證錯誤訊息
- **AND** 不允許儲存
- **AND** 彈窗 SHALL 保持開啟狀態

#### Scenario: 儲存失敗處理

- **WHEN** 使用者嘗試儲存標題
- **AND** Supabase 更新操作失敗（例如網路錯誤）
- **THEN** 系統 SHALL 顯示錯誤訊息「儲存失敗，請稍後再試」
- **AND** 彈窗 SHALL 保持開啟狀態
- **AND** 標題 SHALL 保持原狀

#### Scenario: 重新載入頁面後標題保持

- **WHEN** 使用者已儲存自訂標題
- **AND** 重新載入頁面或在其他裝置登入
- **THEN** 系統 SHALL 從 Supabase 讀取並顯示使用者的自訂標題
- **AND** 若資料庫中無標題，則顯示預設值「裝備管理」

### Requirement: Database Schema Extension

系統 MUST 擴充 Supabase `gear` 表的 schema，以支援儲存使用者自訂的 dashboard 標題。

#### Scenario: 新增 dashboard_title 欄位

- **WHEN** 執行資料庫 migration
- **THEN** `gear` 表 SHALL 新增一個 `dashboard_title` 欄位
- **AND** 欄位型別 SHALL 為 `VARCHAR(50)`
- **AND** 欄位 SHALL 允許 NULL 值（預設為 NULL）
- **AND** 現有資料不受影響（向下相容）

#### Scenario: Row Level Security 保護

- **WHEN** 使用者嘗試更新 `dashboard_title`
- **THEN** Supabase RLS 政策 SHALL 確保使用者只能更新自己的裝備資料
- **AND** 其他使用者的資料 SHALL 被保護，不允許存取

### Requirement: Service Layer Methods

系統 MUST 提供型別安全的服務層方法來管理 dashboard 標題。

#### Scenario: 更新標題方法

- **WHEN** 呼叫 `updateDashboardTitle(userId, newTitle)` 方法
- **THEN** 系統 SHALL 更新該使用者在 `gear` 表中第一筆資料的 `dashboard_title` 欄位
- **AND** 若該使用者尚無任何 gear 資料，系統 SHALL 返回錯誤訊息
- **AND** 方法 SHALL 返回 `{ data, error }` 格式的結果

#### Scenario: 讀取標題方法

- **WHEN** 呼叫 `getDashboardTitle(userId)` 方法
- **THEN** 系統 SHALL 讀取該使用者在 `gear` 表中第一筆資料的 `dashboard_title` 欄位
- **AND** 若欄位為 NULL 或無資料，方法 SHALL 返回 NULL
- **AND** 方法 SHALL 返回 `{ data: string | null, error }` 格式的結果

