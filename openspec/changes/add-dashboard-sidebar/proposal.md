# Dashboard Sidebar 提案

## Why
Dashboard 頁面目前僅有 Navbar，缺乏側邊導航欄來提供快速切換不同功能區域的能力。為了提升使用者在後台管理時的導航體驗，需要新增一個垂直側邊欄（Sidebar），包含主要功能模組的快捷入口。

## What Changes
- 新增 `SideBar` 元件，提供以下導航選項：
  - **裝備管理** (Equipment Management) - 使用 `lock` 圖標
  - **旅程管理** (Trip Management) - 使用 `luggage` 圖標，並標示「即將上線」標籤
  - **個人檔案** (Profile) - 使用 `person` 圖標
  - **功能回饋** (Feedback) - 使用 `settings` 圖標
- Sidebar 採用垂直布局，固定於頁面左側
- 每個選項顯示圖標與文字標籤
- 支援 hover 互動效果
- 使用 Google Material Icons ([https://fonts.google.com/icons](https://fonts.google.com/icons))

## Impact
- **新增規範**: `dashboard-navigation` - 定義 Dashboard 導航系統的行為與互動
- **受影響檔案**:
  - `components/features/layout/SideBar.tsx` - 實作 Sidebar 元件
  - `app/dashboard/page.tsx` - 整合 Sidebar 到 Dashboard 頁面
  - 可能需要新增圖標相關依賴（如 `react-icons` 或使用內建 SVG）

