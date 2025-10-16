![OutShare Logo](/public/OutShare.svg)

專為戶外活動愛好者設計的個人化作品集頁面。一個極簡、現代且功能強大的「戶外版 Linktree」，用於集中展示您的旅程、裝備與社群足跡。

![signup logo](/public/illustration.svg)

---

## ✨ 核心功能 (Core Features)

*   **🎨 個人化頁首**: 包含自訂頭像、名稱、個人簡介以及所有社群媒體連結。
*   **🗺️ 旅程分頁 (Trips Tab)**: 以精美的卡片列表展示您的所有戶外旅程。點擊後可展開詳細視窗，包含：
    *   多圖輪播展示。
    *   Markdown 格式的詳細心得與紀錄。
    *   該次旅程所使用的裝備清單。
    *   自定義標籤 (如：`單日健行`, `百岳`, `露營`)。
*   **🎒 裝備分頁 (Gear Tab)**: 以可收合的分類方式，整齊陳列您的所有個人裝備。
    *   每項裝備包含圖片、規格、標籤與購買連結。
*   **🔐 使用者系統**: 完整的註冊與登入功能，讓每位使用者都能安全地管理自己的個人頁面。

---

## 🚀 技術架構 (Tech Stack)

本專案採用一套現代化、高效能且高度可擴展的 Serverless 技術組合。

| 組件 | 技術選擇 |
| :--- | :--- |
| **前端框架** | **Next.js (React)** |
| **樣式方案** | **Tailwind CSS** |
| **UI 元件** | **Shadcn/ui** |
| **後端即服務 (BaaS)** | **Supabase** |
| &nbsp;&nbsp; ▸ **資料庫** | **PostgreSQL** |
| &nbsp;&nbsp; ▸ **身份驗證** | **Supabase Auth** (搭配 RLS) |
| **ORM** | **Prisma** |
| **檔案/圖片儲存** | **Cloudflare R2** |
| **圖片處理/優化** | **Imgproxy** |
| **部署平台** | **Cloudflare Pages** |

---

## 🛠️ 本地開發設定 (Getting Started)

依照以下步驟，即可在您的本機環境中啟動此專案。

### 1. **前置需求 (Prerequisites)**

*   [Node.js](https://nodejs.org/) (建議版本 v18.0 或以上)
*   [pnpm](https://pnpm.io/) (或使用 `npm`, `yarn`)

### 2. **取得專案**

複製此專案的儲存庫到您的本地電腦。
```bash
git clone https://github.com/your-username/outdoor-trails-hub.git
cd outdoor-trails-hub
```

### 3. **安裝依賴套件**

使用 `pnpm` 安裝所有需要的套件。
```bash
pnpm install
```

### 4. **設定環境變數**

本專案需要連接到 Supabase 以進行資料庫與身份驗證。

*   首先，複製 `.env.example` 檔案並重新命名為 `.env.local`。
    ```bash
    cp .env.example .env.local
    ```
*   接著，登入您的 [Supabase 儀表板](https://supabase.com/)，找到您專案的設定值，並填入 `.env.local` 檔案中：

    ```env
    # 從 Supabase -> Settings -> Database -> Connection string 取得
    # 將 [YOUR-PASSWORD] 替換為您的資料庫密碼
    DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxx.supabase.co:5432/postgres"

    # 從 Supabase -> Settings -> API 取得
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

### 5. **同步資料庫結構**

執行 Prisma 指令，它會讀取 `prisma/schema.prisma` 檔案，並自動在您的 Supabase 資料庫中建立對應的資料表。
```bash
npx prisma db push
```

### 6. **啟動開發伺服器**

一切就緒！執行以下指令來啟動 Next.js 開發伺服器。
```bash
pnpm dev
```
現在，您可以在瀏覽器中開啟 `http://localhost:3000` 來查看運作中的應用程式。

---

## 🌍 部署 (Deployment)

本專案已為 **Cloudflare Pages** 進行了最佳化設定。

1.  將您的專案推送到 GitHub 儲存庫。
2.  在 Cloudflare Pages 儀表板中，連接到該儲存庫。
3.  在 `Build settings` 中，設定**建置命令 (Build command)** 為：
    ```bash
    npx prisma generate && next build
    ```
4.  將您在 `.env.local` 中設定的所有環境變數，安全地添加到 Cloudflare Pages 的環境變數設定中。
5.  完成設定後，每一次推送到 `main` 分支都將觸發自動化部署。

---

---

## 📚 開發文件 (Documentation)

### 架構與開發指南
- **[架構指南](docs/ARCHITECTURE_GUIDE.md)** - 完整的架構設計、開發規範和最佳實踐
- **[快速參考](docs/QUICK_REFERENCE.md)** - 常用指令、路徑和模式速查表
- **[重構指南](docs/REFACTORING_GUIDE.md)** - 從舊架構遷移到新架構的指南
- **[重構總結](docs/REFACTORING_SUMMARY.md)** - 重構成果和變更總結

### 設定與部署
- **[Google 登入設定](docs/SETUP_GOOGLE_AUTH.md)** - Google OAuth 完整設定指南
- **[部署說明](docs/DEPLOYMENT_NOTE.md)** - 部署到各平台的詳細步驟
- **[快速開始](docs/QUICK_START.md)** - 快速上手指南

### 技術文件
- **[已修復問題](docs/FIXED_ISSUES.md)** - 已解決的技術問題記錄
- **[實作總結](docs/IMPLEMENTATION_SUMMARY.md)** - 功能實作總結

---

## 📜 授權條款 (License)

本專案採用 [MIT License](LICENSE) 授權。
