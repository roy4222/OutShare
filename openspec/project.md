# Project Context

## Purpose
Outdoor Trails Hub (OutShare) 是專為戶外活動愛好者設計的個人化作品集平台，類似「戶外版 Linktree」。讓使用者能夠集中展示他們的戶外旅程、裝備清單與社群足跡，提供極簡、現代且功能強大的展示體驗。

**核心目標**:
- 提供個人化的戶外活動作品集頁面
- 讓使用者輕鬆分享旅程紀錄、裝備與社群連結
- 打造一個專屬於戶外活動愛好者的社群平台

## Tech Stack

### 前端
- **Next.js 15.5.2** (App Router) - React 全端框架
- **React 19.1.0** - UI 函式庫
- **TypeScript 5** - 型別安全
- **Tailwind CSS 4** - 樣式框架
- **Shadcn/ui** - UI 元件庫（基於 Radix UI）
- **Framer Motion** - 動畫效果
- **Swiper** - 輪播元件
- **FontAwesome** - 圖標庫

### 後端
- **Supabase** - Backend-as-a-Service
  - PostgreSQL 資料庫
  - Supabase Auth (搭配 Row Level Security)
  - Realtime subscriptions
- **Prisma** - ORM（資料庫存取層）

### 雲端服務
- **Cloudflare Workers** - 主要部署平台（Serverless 運算）
- **Cloudflare R2** - 物件儲存（圖片/檔案）
- **OpenNext.js Cloudflare** - Next.js 部署適配器

### 開發工具
- **ESLint** - 程式碼檢查
- **Wrangler** - Cloudflare 開發工具

## Project Conventions

### Code Style
- **語言**: 優先使用 **TypeScript**，確保型別安全
- **格式化**: 使用 ESLint 自動檢查與格式化
- **命名規範**:
  - 元件: `PascalCase` (e.g., `TripCard`, `GearList`)
  - 函數/變數: `camelCase` (e.g., `getUserTrips`, `gearList`)
  - 檔案名稱: 
    - 元件檔案: `PascalCase.tsx`
    - 工具函數: `camelCase.ts`
    - 路由檔案: 遵循 Next.js App Router 慣例
- **React 規範**:
  - 使用 Functional Components 和 Hooks
  - 避免 Class Components
  - 使用 Server Components 作為預設，Client Components 明確標註 `'use client'`

### Architecture Patterns

#### 資料夾結構
```
outdoor-trails-hub/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # 認證相關路由群組
│   ├── (dashboard)/       # 儀表板路由群組
│   ├── [username]/        # 動態使用者公開頁面
│   ├── api/               # API Routes
│   └── layout.tsx         # Root Layout
├── components/            # 可重用 UI 元件
│   ├── ui/               # Shadcn/ui 基礎元件
│   └── ...               # 功能性元件
├── lib/                   # 工具函數與核心邏輯
│   ├── supabase/         # Supabase 用戶端設定
│   ├── prisma/           # Prisma 設定
│   └── utils/            # 通用工具函數
├── types/                 # TypeScript 型別定義
├── prisma/               # Prisma Schema 與 migrations
├── public/               # 靜態資源
├── docs/                 # 專案文件
└── openspec/             # OpenSpec 規範文件
```

#### 關鍵架構決策
- **Server Components First**: 預設使用 Server Components，減少客戶端 JavaScript
- **SSR/ISR**: 利用 Next.js 的伺服器端渲染與增量靜態再生
- **API Routes**: 使用 Next.js API Routes 處理伺服器端邏輯
- **Row Level Security (RLS)**: 在 Supabase 層級實作資料存取控制
- **Prisma as ORM**: 使用 Prisma 作為型別安全的資料庫存取層

### Testing Strategy
- **開發階段**: 目前著重於功能開發，尚未建立完整測試套件
- **未來規劃**:
  - 單元測試: Jest + React Testing Library
  - E2E 測試: Playwright 或 Cypress
  - 型別檢查: TypeScript compiler (`tsc --noEmit`)

### Git Workflow
- **主要分支**:
  - `main` - 正式環境，與生產部署同步
  - `develop` - 開發分支（如有需要）
- **功能分支**: `feature/<feature-name>`
- **修復分支**: `fix/<issue-name>`
- **Commit 規範**:
  - `feat:` - 新功能
  - `fix:` - 錯誤修復
  - `docs:` - 文件更新
  - `refactor:` - 重構（不改變功能）
  - `style:` - 格式調整（不影響程式碼）
  - `test:` - 測試相關
  - `chore:` - 建置流程或工具變更

## Domain Context

### 核心概念
- **使用者 (User)**: 註冊的戶外活動愛好者，擁有個人化頁面
- **旅程 (Trip)**: 使用者的戶外活動紀錄
  - 包含多張圖片、Markdown 心得、裝備清單、標籤
  - 支援多種活動類型：登山、健行、露營、攀岩等
- **裝備 (Gear)**: 使用者的個人裝備清單
  - 分類展示（如：背包系統、睡眠系統、炊具等）
  - 包含圖片、規格、標籤、購買連結
- **社群連結 (Social Links)**: 整合外部社群平台連結
  - Instagram、Facebook、YouTube、Strava 等

### 使用者流程
1. **註冊/登入** → 建立個人帳號
2. **設定個人資料** → 上傳頭像、填寫簡介、新增社群連結
3. **新增旅程** → 上傳照片、撰寫心得、標記裝備
4. **管理裝備** → 建立裝備清單、分類整理
5. **分享頁面** → 透過個人化 URL 分享給他人

## Important Constraints

### 技術限制
- **Cloudflare Workers 限制**:
  - Worker 腳本大小限制（需使用 OpenNext.js 適配）
  - CPU 執行時間限制（免費方案 10ms，付費方案 50ms）
  - 記憶體限制（128MB）
  - 需要特殊配置來支援 Next.js 完整功能
- **Supabase 免費方案限制**:
  - 500MB 資料庫儲存空間
  - 1GB 檔案儲存空間
  - 需注意用量管理

### 安全性要求
- 所有資料存取須透過 Supabase RLS 保護
- 敏感資訊（如 API 金鑰）須存放在環境變數
- 使用者上傳內容需進行驗證與清理

### 效能目標
- 首次內容繪製 (FCP) < 1.5 秒
- 最大內容繪製 (LCP) < 2.5 秒
- 累積版面配置位移 (CLS) < 0.1
- 圖片需經過優化與壓縮

## External Dependencies

### 必要服務
- **Supabase**:
  - 資料庫（PostgreSQL）
  - 身份驗證（Google OAuth）
  - 檔案儲存
  - Realtime API
- **Cloudflare**:
  - Workers (Serverless 運算 + 部署平台)
  - R2 (物件儲存)

### 可選服務
- **Google Analytics**: 流量分析（如需要）
- **Sentry**: 錯誤追蹤（未來考慮）

### 套件管理
- 使用 `npm` 或 `pnpm` 作為套件管理工具
- 定期更新依賴套件，確保安全性
- 謹慎評估新增的依賴項，避免專案過度膨脹
