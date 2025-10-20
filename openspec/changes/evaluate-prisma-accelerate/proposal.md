## Why
目前專案使用 Supabase 作為主要資料庫服務，但程式碼中發現有使用 Prisma Accelerate 的註釋代碼。需要評估是否需要引入 Prisma Accelerate 來提升資料庫查詢效能。

## What Changes
- 評估當前 Supabase + Cloudflare Workers 架構的效能表現
- 分析 Prisma Accelerate 的潛在效益
- 決定是否引入 Prisma ORM 與 Accelerate 擴展
- 如果決定不使用，記錄決策理由並清理註釋代碼

## Impact
- Affected specs: database 資料庫存取規範
- Affected code: lib/prisma.ts, lib/services/ 下的所有服務
- **BREAKING**: 如果決定引入 Prisma，可能需要重構所有資料庫操作邏輯
- 部署影響：可能增加 bundle 大小，對 Cloudflare Workers 記憶體有限制
