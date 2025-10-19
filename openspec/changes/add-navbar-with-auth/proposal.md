# Proposal: 新增整合認證的導航列元件

## Why

目前的 Navbar 元件僅展示基本的 Logo，缺少使用者認證整合和導航功能。需要一個完整的導航列系統，讓已登入使用者能夠：
- 看到自己的 Google 頭像
- 透過下拉選單存取登出功能
- 在手機版使用漢堡選單進行導航

## What Changes

- 升級 `components/features/layout/Navbar.tsx` 為功能完整的導航列
- 整合 `useAuth` hook 以獲取使用者資料和頭像
- 使用 shadcn/ui 的 Dropdown Menu 元件用於使用者選單
- 實作桌面版：左側顯示 OutShare Logo，右側顯示使用者頭像和下拉選單
- 實作手機版：漢堡選單以觸發側邊導航
- 支援登出功能
- 白色背景，隨頁面滾動（非固定）

## Impact

### Affected specs
- 新增 `navbar-component` - 導航列元件規範

### Affected code
- `components/features/layout/Navbar.tsx` - 主要變更
- 安裝並使用 shadcn/ui 的 `dropdown-menu` 元件
- `lib/hooks/useAuth.ts` - 已存在，將被使用
- `asset/logo/OutshareLogo.tsx` - 已存在，將被使用
- 使用 `components/ui/avatar.tsx` - 已存在的頭像元件
- 使用 `components/ui/button.tsx` - 已存在的按鈕元件

