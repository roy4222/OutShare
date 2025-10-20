# Add Gear Dashboard Title Editor

## Why

使用者需要能夠自訂 GearDashboard 頁面的標題（例如從「裝備管理」改成「租借裝備」或「我的裝備」），以符合個人化需求。目前標題是硬編碼的，無法彈性調整，不利於使用者個性化他們的裝備管理頁面。

## What Changes

- 在 Supabase `gear` 表中新增 `dashboard_title` 欄位（選擇性，預設為 NULL）
- 建立 `CategoryModal` 元件，使用 Radix UI Dialog 實作編輯彈窗
- 在 GearDashboard 頁面整合標題編輯功能
  - 點擊 `SquarePenIcon` 開啟編輯彈窗
  - 彈窗包含輸入框、取消與儲存按鈕
  - 儲存後將標題更新至 Supabase
- 建立 Supabase service 方法來更新使用者的 dashboard_title
- 頁面載入時從資料庫讀取自訂標題（若無則顯示預設值「裝備管理」）

## Impact

- **Affected specs**: `gear-management` (new capability)
- **Affected code**:
  - `supabase/migrations/` - 新增 migration 檔案
  - `lib/database.types.ts` - 更新型別定義
  - `lib/services/supabase/gear.service.ts` - 新增更新方法
  - `components/features/dashboard/CategoryModal.tsx` - 新元件
  - `app/GearDashboard/page.tsx` - 整合編輯功能
- **Breaking changes**: 無，向下相容

