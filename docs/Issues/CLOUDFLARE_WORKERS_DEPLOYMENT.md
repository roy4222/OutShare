# 🚀 Cloudflare Pages + Workers 部署指南

使用 `@cloudflare/next-on-pages` 在 Cloudflare Pages 上部署完整功能的 Next.js 應用。

## ✨ 優勢

- ✅ **完整支援 Middleware** - Session 自動更新
- ✅ **支援 API Routes** - OAuth callback 正常運作
- ✅ **支援 Server-side Rendering**
- ✅ **全球 CDN** - Cloudflare 的全球網路
- ✅ **免費方案** - 個人專案足夠使用

## 📋 部署步驟

### 1. 本地測試建置

確保專案可以正常建置：

\`\`\`bash
# 標準 Next.js 建置
npm run build

# Cloudflare Workers 建置
npm run pages:build
\`\`\`

如果成功，你會看到：
\`\`\`
✨ Compiled Worker successfully
\`\`\`

### 2. 推送到 GitHub

\`\`\`bash
git add .
git commit -m "feat: add Cloudflare Workers support"
git push origin main
\`\`\`

### 3. 在 Cloudflare Pages 設定專案

#### 3.1 連接 GitHub

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 前往 **Workers & Pages**
3. 點擊 **Create application**
4. 選擇 **Pages** → **Connect to Git**
5. 授權 GitHub 並選擇你的 repository: `roy4222/OutShare`

#### 3.2 配置建置設定

**重要：不要選擇預設的 Next.js preset！**

手動設定如下：

| 配置選項 | 值 |
|---------|---|
| **Framework preset** | None（不要選擇） |
| **Build command** | \`npm run pages:build\` |
| **Build output directory** | \`.vercel/output/static\` |
| **Root directory** | （留空） |
| **Environment variables** | （下一步設定） |

#### 3.3 設定環境變數

點擊 **Add environment variable**，添加以下變數：

**所有環境都需要設定（Production, Preview, Development）：**

\`\`\`
NEXT_PUBLIC_SUPABASE_URL = 你的_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的_SUPABASE_ANON_KEY
\`\`\`

如果使用 Prisma：
\`\`\`
DATABASE_URL = 你的_DATABASE_URL
\`\`\`

⚠️ **重要**：每個變數都要在三個環境中設定！

#### 3.4 部署

點擊 **Save and Deploy**

Cloudflare Pages 會：
1. Clone 你的 repository
2. 執行 \`npm install\`
3. 執行 \`npm run pages:build\`
4. 部署到全球網路

通常需要 3-5 分鐘。

### 4. 更新 Supabase Redirect URLs

部署完成後，獲取你的 Cloudflare Pages URL：
\`\`\`
https://outdoor-trails-hub.pages.dev
\`\`\`

前往 **Supabase Dashboard** → **Authentication** → **URL Configuration**

添加到 **Redirect URLs**：
\`\`\`
https://outdoor-trails-hub.pages.dev/auth/callback
https://你的自訂網域.com/auth/callback  (如果有)
\`\`\`

### 5. 驗證部署

訪問你的 Cloudflare Pages URL：

1. ✅ 首頁可以正常載入
2. ✅ 點擊 Google 登入
3. ✅ 認證後正確重定向
4. ✅ Dashboard 頁面正常顯示
5. ✅ 登出功能正常

## 🔄 自動部署

設定完成後，每次推送到 GitHub 都會自動觸發部署：

\`\`\`bash
git add .
git commit -m "feat: new feature"
git push origin main
\`\`\`

Cloudflare Pages 會自動：
1. 偵測到新的 commit
2. 開始建置
3. 部署新版本
4. 提供預覽 URL

## 🌐 自訂網域

### 1. 添加網域

在 Cloudflare Pages 專案：

**Custom domains** → **Set up a custom domain**

輸入你的網域：\`outshare.com\`

### 2. DNS 設定

如果你的網域已經在 Cloudflare：
- DNS 記錄會自動設定 ✅

如果網域在其他註冊商：
- 添加 CNAME 記錄指向 \`outdoor-trails-hub.pages.dev\`

### 3. SSL/TLS

Cloudflare 會自動提供：
- ✅ 免費 SSL 憑證
- ✅ 自動 HTTPS
- ✅ HTTP/2 和 HTTP/3

### 4. 更新 Supabase

記得在 Supabase 添加自訂網域的 redirect URL：
\`\`\`
https://outshare.com/auth/callback
\`\`\`

## 🧪 本地開發與預覽

### 本地開發（標準 Next.js）

\`\`\`bash
npm run dev
\`\`\`

訪問 \`http://localhost:3000\`

### 本地預覽（Cloudflare Workers 環境）

\`\`\`bash
# 建置並啟動 Cloudflare Workers 本地伺服器
npm run preview
\`\`\`

這會在本地模擬 Cloudflare Workers 環境。

**設定本地環境變數：**

1. 複製 \`.dev.vars.example\` 為 \`.dev.vars\`
2. 填入你的環境變數

\`\`\`.dev.vars
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

## 🔍 除錯與日誌

### 查看建置日誌

1. 前往 Cloudflare Pages Dashboard
2. 選擇你的專案
3. 點擊最新的部署
4. 查看 **Build log**

### 查看執行時日誌

**Real-time Logs** (Beta):

1. 專案設定 → **Functions**
2. 啟用 **Real-time Logs**
3. 查看即時日誌

### 常見問題

#### ❌ 建置失敗

**錯誤：** \`Error: Command failed with exit code 1\`

**解決：**
\`\`\`bash
# 本地測試建置
npm run pages:build

# 檢查錯誤訊息
\`\`\`

#### ❌ Middleware 不執行

**檢查：**
1. \`middleware.ts\` 在根目錄 ✅
2. \`next.config.ts\` 沒有 \`output: 'export'\` ✅
3. 使用 \`npm run pages:build\` 建置 ✅

#### ❌ 環境變數沒生效

**解決：**
1. 確認變數名稱正確（\`NEXT_PUBLIC_\` 開頭）
2. 在所有環境都設定（Production/Preview/Development）
3. 重新部署專案

#### ❌ 404 錯誤

**檢查：**
1. Build output directory 設定為 \`.vercel/output/static\` ✅
2. Build command 是 \`npm run pages:build\` ✅

## 📊 效能監控

### Cloudflare Analytics

免費包含：
- 📈 頁面訪問量
- 🌍 訪客地理分布
- ⚡ 效能指標
- 🔒 安全威脅

啟用方式：
專案設定 → **Analytics** → **Enable Web Analytics**

### 自訂監控

可以整合：
- Sentry（錯誤追蹤）
- LogTail（日誌管理）
- Datadog（APM）

## 🚀 效能優化

### 1. 啟用快取

\`\`\`typescript
// app/api/trips/route.ts
export const runtime = 'edge'; // 使用 Edge Runtime
export const revalidate = 3600; // 快取 1 小時
\`\`\`

### 2. 使用 Edge Runtime

\`\`\`typescript
// middleware.ts
export const config = {
  runtime: 'edge',
};
\`\`\`

### 3. 圖片優化

確保使用 \`next/image\`：
\`\`\`typescript
import Image from 'next/image';

<Image 
  src="/photo.jpg"
  width={800}
  height={600}
  alt="Photo"
/>
\`\`\`

## 🔐 安全性

### 環境變數安全

- ✅ 使用 \`NEXT_PUBLIC_\` 前綴的變數會暴露給客戶端
- ✅ 不要在 \`NEXT_PUBLIC_\` 變數中放敏感資訊
- ✅ API Keys 使用 Server-only 變數

### CORS 設定

如果需要，在 \`next.config.ts\` 設定：

\`\`\`typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ];
}
\`\`\`

## 📝 部署檢查清單

部署前確認：

- [ ] \`npm run build\` 本地成功
- [ ] \`npm run pages:build\` 本地成功
- [ ] 環境變數已設定（所有環境）
- [ ] Supabase redirect URLs 已更新
- [ ] \`next.config.ts\` 沒有 \`output: 'export'\`
- [ ] 程式碼已推送到 GitHub
- [ ] Cloudflare Pages 建置設定正確

部署後驗證：

- [ ] 首頁正常載入
- [ ] Google 登入功能正常
- [ ] Dashboard 需要認證
- [ ] 登出功能正常
- [ ] 所有圖片正常顯示

## 🔗 相關資源

- [@cloudflare/next-on-pages 文件](https://github.com/cloudflare/next-on-pages)
- [Cloudflare Pages 文件](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文件](https://developers.cloudflare.com/workers/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

---

**準備部署了嗎？** 🚀

1. 執行 \`npm run pages:build\` 測試
2. 推送到 GitHub
3. 在 Cloudflare Pages 設定專案
4. 享受全球 CDN 的速度！

