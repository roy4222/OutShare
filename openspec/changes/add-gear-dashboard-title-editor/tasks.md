# Implementation Tasks

## 1. 資料庫層（Database Layer）
- [x] 1.1 建立 migration 檔案：在 `gear` 表新增 `dashboard_title` 欄位（VARCHAR, NULLABLE）
- [x] 1.2 執行 migration 並驗證欄位已正確建立
- [x] 1.3 更新 `lib/database.types.ts` 型別定義（執行 `npx supabase gen types typescript`）

## 2. 服務層（Service Layer）
- [x] 2.1 在 `lib/services/supabase/gear.service.ts` 新增 `updateDashboardTitle()` 方法
- [x] 2.2 新增 `getDashboardTitle()` 方法來讀取使用者的自訂標題
- [x] 2.3 確保方法包含錯誤處理與型別安全

## 3. UI 元件（Components）
- [x] 3.1 建立 `CategoryModal.tsx` 元件，使用 `@/components/ui/dialog`
- [x] 3.2 實作彈窗內容：
  - 標題文字「編輯」
  - 說明文字「此處能更改前台『我的裝備』頁籤名稱。」
  - 輸入框（預設值為當前標題）
  - 取消按鈕（關閉彈窗）
  - 儲存按鈕（觸發更新）
- [x] 3.3 加入表單驗證（非空值、最大長度限制）
- [x] 3.4 新增 loading 狀態與錯誤提示

## 4. 頁面整合（Page Integration）
- [x] 4.1 在 `GearDashboard/page.tsx` 引入 `CategoryModal`
- [x] 4.2 使用 React state 管理彈窗開啟/關閉狀態
- [x] 4.3 將 `SquarePenIcon` 改為可點擊，觸發彈窗開啟
- [x] 4.4 頁面載入時呼叫 `getDashboardTitle()` 取得自訂標題
- [x] 4.5 如果無自訂標題，顯示預設值「裝備管理」
- [x] 4.6 儲存成功後更新頁面顯示的標題

## 5. 測試與驗證（Testing & Validation）
- [x] 5.1 測試新增標題（輸入新標題並儲存）
- [x] 5.2 測試編輯已存在的標題
- [x] 5.3 測試取消操作（不應儲存變更）
- [x] 5.4 測試表單驗證（空值、過長字串）
- [x] 5.5 測試跨使用者隔離（確保 RLS 正常運作）
- [x] 5.6 測試錯誤處理（網路錯誤、資料庫錯誤）

## 6. 文件與清理（Documentation & Cleanup）
- [x] 6.1 更新相關註解與 JSDoc
- [x] 6.2 確認無 ESLint 錯誤
- [x] 6.3 確認所有檔案遵循專案命名規範

