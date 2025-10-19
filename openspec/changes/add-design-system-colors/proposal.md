# Add Design System Colors

## Why
為了建立統一的視覺設計系統，需要在 Tailwind CSS v4 中定義專案的標準色彩調色板。這些顏色將用於整個應用程式，確保 UI 一致性並符合品牌設計規範。

## What Changes
- 在 `app/globals.css` 中新增自訂顏色變數
- 定義綠色系列 (green-200, 600, 700, 800)
- 定義灰色系列 (grey-100 到 grey-900)
- 定義白色與紅色強調色
- 定義品牌漸層色 (從 #00AC8E 到 #0097E0)
- 透過 `@theme` 指令將這些顏色註冊到 Tailwind 的色彩系統

## Impact
- **Affected specs**: `design-system` (新建)
- **Affected code**: 
  - `app/globals.css` - 新增顏色變數定義
  - 全專案可使用新的顏色類別 (如 `bg-green-700`, `text-grey-500`)
- **No breaking changes** - 現有 Tailwind 預設顏色仍可使用

