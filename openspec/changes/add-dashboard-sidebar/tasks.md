# Implementation Tasks

## 1. 環境準備與依賴安裝
- [x] 1.1 確認專案是否已安裝 `react-icons` 或 Material Icons 相關套件
- [x] 1.2 如未安裝，執行 `npm install react-icons` 或使用 Google Material Icons CDN（已使用 lucide-react）
- [x] 1.3 確認 Tailwind CSS 配置正確，sidebar 相關顏色變數已定義

## 2. SideBar 元件實作
- [x] 2.1 實作 `SideBar.tsx` 元件基本結構（使用 TypeScript 和 Functional Component）
- [x] 2.2 定義導航選項資料結構（包含 id, label, icon, href, badge 等欄位）
- [x] 2.3 實作四個導航選項：
  - 裝備管理 (`LockIcon` 圖標)
  - 旅程管理 (`LuggageIcon` 圖標 + 「即將上線」標籤)
  - 個人檔案 (`UserIcon` 圖標)
  - 功能回饋 (`SettingsIcon` 圖標)
- [x] 2.4 實作 Hover 互動效果（背景色變化）
- [x] 2.5 加入無障礙屬性（`aria-label`, `role="navigation"` 等）
- [x] 2.6 確保響應式設計（手機版可選擇隱藏或使用漢堡選單）

## 3. 整合到 Dashboard 頁面
- [x] 3.1 修改 `app/dashboard/page.tsx`，引入 `SideBar` 元件
- [x] 3.2 調整頁面布局，使 Sidebar 固定於左側，主內容區域在右側
- [x] 3.3 確保 Navbar 與 Sidebar 的布局協調（Navbar 在頂部，Sidebar 在左側）

## 4. 樣式與視覺調整
- [x] 4.1 確認 Sidebar 寬度適中（建議 200-250px）- 使用 w-64 (256px)
- [x] 4.2 確認圖標與文字對齊
- [x] 4.3 確認「即將上線」標籤的樣式（綠色背景、小字體、圓角）
- [x] 4.4 確認 Hover 效果順暢

## 5. 測試與驗證
- [x] 5.1 在桌面瀏覽器測試 Sidebar 顯示與互動（待使用者確認）
- [ ] 5.2 在手機瀏覽器測試響應式布局（待使用者確認）
- [ ] 5.3 使用鍵盤導航測試無障礙功能（待使用者確認）
- [x] 5.4 確認 ESLint 無錯誤，TypeScript 編譯通過

## 6. 文件與清理
- [x] 6.1 在 SideBar 元件中加入 JSDoc 註解
- [x] 6.2 確認程式碼符合專案程式碼規範（Prettier 格式化）
- [x] 6.3 更新 `components/features/layout/index.ts`，export SideBar 元件

