# 🎯 Supabase 到 Prisma 重構提案 - 執行摘要

## 📋 提案概述

**變更 ID**: `refactor-supabase-to-prisma`  
**狀態**: ⏳ 待批准  
**預計工時**: 6-8 天  
**影響範圍**: 🔴 **重大變更 (Breaking Changes)**

---

## 🎯 目標

將專案的資料存取層從 **Supabase SDK** 完全遷移到 **Prisma ORM**，同時保留 Supabase 的身份驗證服務。

### 為什麼要做這個改變？

1. **簡化架構** - 目前同時使用 Supabase SDK 和準備用 Prisma，造成混亂
2. **提升型別安全** - Prisma 提供完整的 TypeScript 型別推導
3. **本地開發** - 使用 Docker 運行本地 Supabase，無需依賴雲端
4. **降低成本** - 減少對雲端服務的依賴
5. **更好的 ORM** - Prisma 的查詢 API 更現代、更易用

---

## 🏗️ 架構變更

### 之前（現狀）
```
┌─────────────────────┐
│   React Components  │
└──────────┬──────────┘
           │
┌──────────▼──────────────────────────┐
│  lib/services/supabase/             │
│  - trips.service.ts                 │
│  - equipment.service.ts             │
│  (使用 Supabase SDK)                │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│  Supabase Cloud                     │
│  - PostgreSQL                       │
│  - Auth                             │
│  - RLS                              │
└─────────────────────────────────────┘
```

### 之後（目標）
```
┌─────────────────────┐
│   React Components  │
└──────┬──────────────┘
       │
       ├──────────────────────────────┐
       │                              │
┌──────▼────────────────┐   ┌─────────▼────────┐
│ lib/services/prisma/  │   │ lib/supabase/    │
│ - trips.service.ts    │   │ (僅 Auth)        │
│ - equipment.service.ts│   └─────────┬────────┘
│ (使用 Prisma Client)  │             │
└──────┬────────────────┘   ┌─────────▼────────┐
       │                    │ Supabase Auth    │
┌──────▼────────────────┐   │ (OAuth, Session) │
│ Local Supabase        │   └──────────────────┘
│ (Docker)              │
│ - PostgreSQL          │
│ - Auth (local dev)    │
└───────────────────────┘
```

---

## 🔄 主要變更

### ✅ 保留的部分
- ✅ **Supabase Auth** - 繼續使用 Google OAuth、Session 管理
- ✅ **資料庫 Schema** - 不改變現有的資料表結構
- ✅ **前端 UI** - 組件介面不變
- ✅ **部署平台** - 仍使用 Cloudflare Workers

### 🔄 重構的部分
- 🔄 **資料存取層** - `lib/services/supabase/` → `lib/services/prisma/`
- 🔄 **型別定義** - 移除 `lib/database.types.ts`，改用 Prisma 生成
- 🔄 **React Hooks** - 更新為使用 Prisma services
- 🔄 **開發環境** - 改用本地 Supabase (Docker)
- 🔄 **檔案儲存** - Supabase Storage → Cloudflare R2 ⭐

### ❌ 移除的部分
- ❌ Supabase SDK 的資料查詢功能（`supabase.from('table')`）
- ❌ `lib/database.types.ts`
- ❌ 對雲端 Supabase 資料庫的直接依賴
- ❌ Supabase Storage 檔案上傳邏輯

---

## 📊 影響分析

### 需要修改的檔案（約 15-20 個）

#### 核心服務層（新建/重寫）
- ✏️ `lib/prisma.ts` - **新建** Prisma Client 單例
- ✏️ `lib/services/prisma/trips.service.ts` - **新建**
- ✏️ `lib/services/prisma/equipment.service.ts` - **新建**
- ✏️ `lib/services/prisma/profiles.service.ts` - **新建**
- ✏️ `prisma/schema.prisma` - **新建** Prisma schema
- ✏️ `app/api/upload/route.ts` - **新建** R2 檔案上傳 API ⭐

#### React Hooks（更新）
- 🔄 `lib/hooks/useTrips.ts`
- 🔄 `lib/hooks/useEquipment.ts`
- 🔄 `lib/hooks/useTripStats.ts`

#### 前端組件（更新）
- 🔄 `app/profile/page.tsx`
- 🔄 `app/GearDashboard/page.tsx`
- 🔄 其他使用資料的頁面

#### Auth 相關（簡化）
- 🔄 `lib/supabase/client.ts` - 保留但加註解
- 🔄 `lib/supabase/server.ts` - 保留但加註解

#### 配置檔案（更新）
- 🔄 `package.json` - 新增 Prisma scripts
- 🔄 `.env.local.example` - 更新環境變數（含 R2） ⭐
- 🔄 `wrangler.toml` - R2 bucket 綁定 ⭐
- 🔄 `supabase/config.toml` - **新建**

#### 需要刪除的檔案
- ❌ `lib/services/supabase/` 整個目錄
- ❌ `lib/database.types.ts`

---

## 📝 實作計畫（11 個階段）

| 階段 | 任務 | 預計時間 | 風險 |
|------|------|---------|------|
| 1 | 環境設定與基礎建設（含 R2） ⭐ | 1 天 | 🟡 中 |
| 2 | 資料服務層重構 | 1.5 天 | 🟡 中 |
| 3 | React Hooks 更新 | 1 天 | 🟢 低 |
| 4 | 前端組件更新 | 1 天 | 🟡 中 |
| 5 | API Routes 更新與檔案上傳 ⭐ | 1 天 | 🟡 中 |
| 6 | Auth 相關程式碼簡化 | 0.5 天 | 🟢 低 |
| 7 | 清理舊程式碼 | 0.5 天 | 🟢 低 |
| 8 | 測試與驗證 | 1 天 | 🔴 高 |
| 9 | 文件更新 | 0.5 天 | 🟢 低 |
| 10 | 部署準備（含圖片遷移） ⭐ | 1 天 | 🟡 中 |
| 11 | 最終檢查 | 0.5 天 | 🟡 中 |

**總計**: 9.5 天（約 2 週）

---

## ⚠️ 風險與緩解措施

### 🔴 高風險

#### 1. 失去資料庫 RLS 保護
- **風險**: Prisma 不支援 PostgreSQL RLS，完全依賴應用層權限檢查
- **緩解**: 
  - 在每個 service 函數嚴格檢查 `userId`
  - 撰寫完整的單元測試
  - 保留資料庫的 RLS policies 作為額外防護

#### 2. Migration 可能引入 bugs
- **風險**: 大量程式碼重寫，可能遺漏邊界情況
- **緩解**:
  - 分階段遷移（trips → gear → profiles）
  - 每階段完成後進行完整功能測試
  - 保留舊程式碼作為參考直到全部測試通過

### 🟡 中風險

#### 3. 部署複雜度增加
- **風險**: 需要確保生產環境 `DATABASE_URL` 正確配置
- **緩解**:
  - 詳細的部署文件
  - 先在測試環境驗證
  - 可繼續使用 Supabase 雲端 PostgreSQL（只是透過 Prisma 連接）

#### 4. 失去 Realtime 功能
- **風險**: 未來若需要即時同步會較困難
- **緩解**: 
  - 目前未使用 Realtime，暫不影響
  - 未來可用 WebSocket 或 SSE 自行實現

---

## ✅ 驗證標準

### 功能測試 Checklist

- [ ] 使用者可以正常登入/登出（Google OAuth）
- [ ] 可以建立、讀取、更新、刪除 Trips
- [ ] 可以建立、讀取、更新、刪除 Gear
- [ ] 可以更新 Profile
- [ ] Trip 與 Gear 的關聯正常運作
- [ ] 權限控制正確（使用者只能修改自己的資料）
- [ ] 公開頁面（`[username]`）正常顯示
- [ ] Profile 頁面完整功能運作
- [ ] Gear Dashboard 完整功能運作

### 技術驗證 Checklist

- [ ] `npm run build` 成功，無 TypeScript 錯誤
- [ ] `npm run lint` 通過
- [ ] 所有 Prisma migrations 可正常執行
- [ ] 本地 Supabase 可正常啟動（`npx supabase start`）
- [ ] 無 N+1 查詢問題
- [ ] 查詢效能與之前相當或更好

---

## 📚 相關文件

建立後的文件結構：

```
docs/
├── database/
│   ├── PRISMA_GUIDE.md         (新建)
│   ├── LOCAL_SETUP.md          (新建)
│   └── MIGRATION_HISTORY.md    (更新)
├── Auth/
│   └── AUTH_ARCHITECTURE.md    (更新)
└── README.md                   (更新)

openspec/
└── changes/
    └── refactor-supabase-to-prisma/
        ├── proposal.md         ✅ 已建立
        ├── design.md           ✅ 已建立
        ├── tasks.md            ✅ 已建立
        ├── SUMMARY.md          ✅ 已建立
        └── specs/
            └── database-layer/
                └── spec.md     ✅ 已建立
```

---

## 🚀 下一步行動

### 立即執行（在批准後）
1. 安裝依賴：`npm install -D prisma @prisma/client supabase`
2. 初始化本地 Supabase：`npx supabase init && npx supabase start`
3. 建立 Prisma schema：`npx prisma init && npx prisma db pull`
4. 開始實作 Phase 2（資料服務層）

### ✅ 已決策的問題
- ✅ **生產環境資料庫**: 繼續使用 Supabase PostgreSQL（透過 Prisma 連接）
- ✅ **檔案儲存**: 遷移到 Cloudflare R2 ⭐
  - 理由：與 Cloudflare Workers 原生整合，零出口流量費
  - 實施：Phase 1 就規劃 R2 bucket 設定
- ✅ **Migration 工具**: 統一使用 Prisma Migrate
- ✅ **Auth 同步**: 使用 Supabase Database Trigger 自動建立 profile

---

## 📞 聯絡與支援

如有任何問題或需要協助，請：
1. 查閱 `design.md` 中的技術決策
2. 參考 `tasks.md` 中的詳細步驟
3. 閱讀 `specs/database-layer/spec.md` 了解規格要求

---

**建立日期**: 2025-10-21  
**OpenSpec 驗證**: ✅ 通過 (`openspec validate refactor-supabase-to-prisma --strict`)  
**準備狀態**: ✅ 可以開始實作

