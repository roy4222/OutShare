# Design System Specification

## ADDED Requirements

### Requirement: Custom Color Palette Definition
系統 SHALL 在 Tailwind CSS v4 配置中定義專案的自訂顏色調色板，包含綠色系列、灰色系列、白色、紅色與漸層色。

#### Scenario: 開發者使用綠色系列類別
- **WHEN** 開發者在元件中使用 `bg-green-700` 類別
- **THEN** 元件背景色應套用 `#00AC8E` 顏色

#### Scenario: 開發者使用灰色系列類別
- **WHEN** 開發者在元件中使用 `text-grey-500` 類別
- **THEN** 文字顏色應套用 `#A1A1A1` 顏色

#### Scenario: 開發者使用漸層色類別
- **WHEN** 開發者在元件中使用 `bg-gradient` 類別
- **THEN** 元件背景應套用從 `#00AC8E` 到 `#0097E0` 的漸層效果

### Requirement: Tailwind v4 Color Registration
系統 SHALL 使用 Tailwind CSS v4 的 `@theme` 指令將自訂顏色註冊到 Tailwind 的色彩系統中，使其可在所有 Tailwind 工具類別中使用。

#### Scenario: 顏色在 hover 狀態中可用
- **WHEN** 開發者使用 `hover:bg-green-700` 類別
- **THEN** hover 狀態應正確套用綠色 700 的顏色

#### Scenario: 顏色在響應式斷點中可用
- **WHEN** 開發者使用 `md:text-grey-800` 類別
- **THEN** 在中型螢幕以上應正確套用灰色 800 的文字顏色

### Requirement: Color Naming Convention
所有自訂顏色 SHALL 遵循以下命名規範：
- 綠色系列使用 `green-{weight}` 格式 (200, 600, 700, 800)
- 灰色系列使用 `grey-{weight}` 格式 (100-900，以 100 為間隔)
- 特殊顏色使用語意化名稱 (`white`, `red-100`)
- 漸層色使用 `gradient` 作為名稱

#### Scenario: 開發者查找可用顏色
- **WHEN** 開發者參考設計系統文件或使用 IDE 自動完成
- **THEN** 所有顏色應遵循一致的命名規範，易於理解與記憶

