# 🪟 Windows 系統 Cloudflare Pages 部署指南

由於 `@cloudflare/next-on-pages` 在 Windows 上有已知問題，我們使用**直接在 Cloudflare Pages 設定**的方式。

## 🎯 快速步驟

### 1. 推送程式碼到 GitHub

\`\`\`bash
git add .
git commit -m "feat: configure for Cloudflare Workers"
git push origin main
\`\`\`

### 2. 在 Cloudflare Pages 設定專案

#### 2.1 登入 Cloudflare

1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 登入你的帳號

#### 2.2 建立 Pages 專案

1. 左側選單 → **Workers & Pages**
2. 點擊 **Create application**
3. 選擇 **Pages** 標籤
4. 點擊 **Connect to Git**

#### 2.3 連接 GitHub

1. 選擇 **GitHub**
2. 授權 Cloudflare 存取你的 GitHub
3. 選擇 repository: **roy4222/OutShare**
4. 點擊 **Begin setup**

#### 2.4 配置建置設定 ⚠️ 重要！

**不要選擇任何 Framework preset！** 手動設定如下：

\`\`\`
Project name: outdoor-trails-hub
Production branch: main
\`\`\`

**Build settings:**

| 設定項目 | 值 |
|---------|---|
| Framework preset | **None**（不選擇） |
| Build command | \`npm run pages:build\` |
| Build output directory | \`.vercel/output/static\` |
| Root directory | （留空） |

#### 2.5 設定環境變數

點擊 **Environment variables (advanced)**

**添加以下變數（所有環境都要設定）：**

1. 點擊 **+ Add variable**
2. 變數名稱：\`NEXT_PUBLIC_SUPABASE_URL\`
3. 值：你的 Supabase URL
4. 勾選：Production, Preview, Development

5. 再次點擊 **+ Add variable**
6. 變數名稱：\`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
7. 值：你的 Supabase Anon Key  
8. 勾選：Production, Preview, Development

#### 2.6 部署！

點擊 **Save and Deploy**

Cloudflare 會在 Linux 環境建置你的專案（不會有 Windows 問題）。

### 3. 等待建置完成

通常需要 3-5 分鐘。你會看到：

✅ **Initializing build environment**  
✅ **Cloning repository**  
✅ **Installing dependencies**  
✅ **Building application**  
✅ **Deploying to Cloudflare's global network**  
✅ **Success!**

### 4. 獲取部署 URL

建置完成後，你會獲得：

\`\`\`
https://outdoor-trails-hub.pages.dev
\`\`\`

或

\`\`\`
https://outdoor-trails-hub-xxx.pages.dev
\`\`\`

### 5. 更新 Supabase

前往 **Supabase Dashboard**：

1. 選擇你的專案
2. **Authentication** → **URL Configuration**
3. 在 **Redirect URLs** 添加：

\`\`\`
https://outdoor-trails-hub.pages.dev/auth/callback
\`\`\`

或使用你實際的 Cloudflare Pages URL。

### 6. 測試部署

訪問你的 Cloudflare Pages URL：

1. ✅ 首頁載入正常
2. ✅ 點擊 Google 登入
3. ✅ 認證成功並重定向
4. ✅ Dashboard 需要登入
5. ✅ 登出功能正常

## 🔄 後續更新

每次推送到 GitHub 會自動重新部署：

\`\`\`bash
git add .
git commit -m "feat: update feature"
git push origin main
\`\`\`

Cloudflare Pages 會自動：
- 偵測新 commit
- 開始建置
- 部署新版本

## 🐛 如果建置失敗

### 檢查建置日誌

1. Cloudflare Pages Dashboard
2. 選擇你的專案
3. 點擊失敗的部署
4. 查看 **Build log**

### 常見錯誤

#### 錯誤 1: "Command not found: pages:build"

**原因：** Cloudflare 沒有找到 npm script

**解決：** 確認 \`package.json\` 有：

\`\`\`json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages"
  }
}
\`\`\`

#### 錯誤 2: "Module not found"

**原因：** 依賴未安裝

**解決：** 確認 \`package.json\` 的 devDependencies 有：

\`\`\`json
{
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.13.16",
    "wrangler": "^4.43.0"
  }
}
\`\`\`

#### 錯誤 3: "Build output directory not found"

**原因：** 建置輸出路徑錯誤

**解決：** 確認 Build output directory 設定為：
\`\`\`
.vercel/output/static
\`\`\`

## ✨ Windows 本地開發

在 Windows 上，使用標準 Next.js 開發即可：

\`\`\`bash
# 本地開發（完全正常）
npm run dev

# 訪問
http://localhost:3000
\`\`\`

**不需要在 Windows 上執行 \`pages:build\`**，讓 Cloudflare 的 Linux 環境處理即可。

## 🎯 總結

| 步驟 | 在哪裡執行 |
|------|----------|
| 開發 | Windows 本地 (\`npm run dev\`) |
| 建置 | Cloudflare Pages (自動) |
| 部署 | Cloudflare Pages (自動) |

這樣你就不會遇到 Windows 相容性問題了！🎉

## 📞 需要協助？

如果遇到問題：
1. 查看 Cloudflare Pages 建置日誌
2. 確認環境變數設定正確
3. 確認 Supabase redirect URLs 正確

