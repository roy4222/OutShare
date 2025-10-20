## Why
目前當使用者訪問不存在的頁面時，Next.js 會顯示預設的 404 錯誤頁面，這個頁面樣式與我們的設計系統不一致，無法提供良好的使用者體驗。需要一個符合品牌設計的 404 頁面，讓使用者能夠輕鬆返回主要頁面。

## What Changes
- 新增自訂 404 錯誤頁面組件
- 在 Next.js App Router 中配置 not-found.tsx 文件
- 頁面將包含：
  - 導航列 (Navbar) 在頁面頂部
  - 友善的錯誤訊息
  - 返回首頁的按鈕
  - 符合設計系統的樣式

## Impact
- Affected specs: 新增 `error-handling` 能力
- Affected code: 新增 `app/not-found.tsx` 文件
- 這是一個非破壞性變更，不會影響現有功能
