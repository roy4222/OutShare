# 🚀 部署說明

## ⚠️ 重要變更

### Next.js 配置調整

為了支援 Google 登入功能，我們已經從 `next.config.ts` 中移除了 `output: 'export'` 設定。

### 為什麼需要這個變更？

`output: 'export'` 是用於生成靜態 HTML 網站的設定，但它與以下功能**不相容**：

- ❌ **Middleware** - 用於自動更新使用者 session
- ❌ **API Routes** - 用於處理 OAuth callback (`/auth/callback`)
- ❌ **Server Components with dynamic features** - 用於伺服器端認證
- ❌ **Cookies** - 用於儲存使用者 session

### Google 登入需要的功能

我們的實作使用了：

1. **Middleware** (`middleware.ts`)
   - 在每個請求前更新使用者 session
   - 確保認證狀態保持最新

2. **API Route** (`app/auth/callback/route.ts`)
   - 處理 Google OAuth 返回的授權碼
   - 將授權碼換成 session token
   - 儲存 session 到 cookies

3. **Server-side Authentication**
   - 在伺服器端驗證使用者身份
   - 保護受限頁面

這些功能都需要 **伺服器端執行環境**，無法在純靜態網站中運作。

---

## 📦 部署選項

你仍然可以將應用程式部署到各種平台，只是不能使用純靜態匯出的方式。

### 推薦的部署平台

#### 1. **Vercel** (最推薦) ⭐

**優點**:
- Next.js 原生支援，零配置
- 自動支援 Middleware 和 API Routes
- 免費方案足夠使用
- 自動 HTTPS
- 全球 CDN

**部署步驟**:
```bash
# 安裝 Vercel CLI (可選)
npm i -g vercel

# 部署
vercel

# 或直接在 Vercel Dashboard 連接 GitHub repository
```

**設定環境變數**:
1. 前往 Vercel Dashboard → 你的專案 → Settings → Environment Variables
2. 添加:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

#### 2. **Netlify**

**優點**:
- 良好的 Next.js 支援
- 免費方案
- 簡單的部署流程

**部署步驟**:
1. 連接 GitHub repository
2. Build command: `npm run build`
3. 在環境變數中設定 Supabase 和 Google 憑證

#### 3. **Railway**

**優點**:
- 支援 Node.js 應用
- 簡單的部署流程
- 免費額度

#### 4. **自架伺服器** (VPS, AWS, GCP 等)

**步驟**:
```bash
# 建置專案
npm run build

# 啟動正式環境伺服器
npm start
```

**需要**:
- Node.js 18+ 執行環境
- 設定環境變數
- 反向代理 (nginx/Apache)
- SSL 憑證

---

## 🔄 如果你仍需要靜態匯出

如果你的專案**必須**使用純靜態匯出（例如部署到 GitHub Pages），你有以下選擇：

### 選項 1: 使用不同的認證方式

使用客戶端 OAuth 流程（不推薦，安全性較低）:
- 使用 Google One-Tap
- 所有認證邏輯在客戶端處理
- 不使用 Middleware 和 API Routes

### 選項 2: 分離前後端

- **前端**: 靜態匯出到 GitHub Pages
- **後端**: 部署到 Vercel/Netlify 處理認證
- 前後端透過 API 通訊

### 選項 3: 使用 Supabase Edge Functions

- 將 OAuth callback 處理移到 Supabase Edge Functions
- 前端仍可靜態匯出
- 較複雜的設定

---

## 📝 現在的配置

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // 已移除: output: 'export'
  
  images: {
    unoptimized: true,  // 仍保留此設定
  },
};
```

這個配置允許：
- ✅ Middleware
- ✅ API Routes
- ✅ Server Components
- ✅ 完整的 Google OAuth 登入功能
- ✅ 部署到 Vercel、Netlify 等平台

---

## 🚀 快速部署到 Vercel

### 1. 推送程式碼到 GitHub

```bash
git add .
git commit -m "feat: add Google OAuth login"
git push origin main
```

### 2. 在 Vercel 部署

1. 前往 https://vercel.com/
2. 點擊 "Import Project"
3. 連接你的 GitHub repository
4. 選擇 `outdoor-trails-hub` repository
5. Vercel 會自動偵測 Next.js 專案
6. 點擊 "Deploy"

### 3. 設定環境變數

在 Vercel Dashboard:
1. 選擇你的專案
2. Settings → Environment Variables
3. 添加以下變數:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 4. 更新 Google OAuth 設定

在 Google Cloud Console，添加 Vercel URL:

**已授權的 JavaScript 來源**:
```
https://your-app.vercel.app
```

**已授權的重新導向 URI**:
```
https://your-app.vercel.app/auth/callback
https://your-project-ref.supabase.co/auth/v1/callback
```

### 5. 更新 Supabase Redirect URLs

在 Supabase Dashboard → Authentication → URL Configuration:
```
https://your-app.vercel.app/auth/callback
```

### 6. 重新部署

在 Vercel Dashboard 點擊 "Redeploy" 或推送新的 commit 觸發自動部署。

---

## ✅ 檢查清單

部署前確認:

- [ ] 程式碼已推送到 GitHub
- [ ] Vercel 專案已建立並連接 repository
- [ ] 環境變數已在 Vercel 設定
- [ ] Google OAuth Redirect URIs 包含正式環境 URL
- [ ] Supabase Redirect URLs 包含正式環境 URL
- [ ] 部署成功且沒有錯誤
- [ ] 在正式環境測試 Google 登入功能

---

## 🐛 疑難排解

### 問題: Middleware 錯誤

**錯誤訊息**: "Middleware cannot be used with output: export"

**解決方法**: 確認 `next.config.ts` 中沒有 `output: 'export'`

### 問題: API Route 404

**錯誤訊息**: "404 Not Found" on `/auth/callback`

**解決方法**: 
- 確認沒有使用 `output: 'export'`
- 確認 `app/auth/callback/route.ts` 存在
- 重新建置專案

### 問題: 環境變數讀取不到

**解決方法**:
- Vercel: 在 Settings → Environment Variables 設定
- 設定後需要重新部署
- 確認變數名稱正確 (必須是 `NEXT_PUBLIC_` 開頭)

---

## 📚 相關資源

- [Next.js Deployment 文檔](https://nextjs.org/docs/deployment)
- [Vercel Deployment 指南](https://vercel.com/docs)
- [Next.js Static Export 限制](https://nextjs.org/docs/advanced-features/static-html-export#unsupported-features)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 💡 總結

- ✅ 已移除 `output: 'export'` 以支援完整的 Google OAuth 功能
- ✅ 應用程式可以部署到 Vercel、Netlify 等平台
- ✅ 所有認證功能正常運作
- ✅ 保持圖片優化設定 (`unoptimized: true`)

**推薦**: 使用 Vercel 部署，最簡單且完全支援 Next.js 所有功能！🚀

