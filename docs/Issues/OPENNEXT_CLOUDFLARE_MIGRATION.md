# 🚀 OpenNext Cloudflare 遷移指南

## 📋 概述

本文件記錄了從 `@cloudflare/next-on-pages` 遷移到 `@opennextjs/cloudflare` 的完整過程，包含所有遇到的問題、解決方案和注意事項。

**遷移日期：** 2025-10-17  
**Next.js 版本：** 15.5.2  
**@opennextjs/cloudflare 版本：** 1.11.0  
**開發環境：** WSL 2 (Ubuntu on Windows)

---

## 🎯 為什麼要遷移？

### @cloudflare/next-on-pages 的限制
- 不支援 ISR (Incremental Static Regeneration)
- 快取功能有限
- 社群支援較少
- 部分 Next.js 功能不完整

### @opennextjs/cloudflare 的優勢
- ✅ 完整支援 Next.js 功能
- ✅ 支援 R2 快取 (ISR/SSG)
- ✅ 更好的效能優化
- ✅ 活躍的社群維護
- ✅ 官方推薦的解決方案

---

## 🔧 遷移步驟

### 1. 安裝套件

```bash
# 安裝 @opennextjs/cloudflare
npm install @opennextjs/cloudflare@latest --ignore-scripts

# 安裝 esbuild（必要依賴）
npm install esbuild --save-dev

# 移除舊套件
npm uninstall @cloudflare/next-on-pages
```

**⚠️ 注意：** 需要使用 `--ignore-scripts` 避免 rclone.js 在 WSL 環境的網路問題。

### 2. 更新 next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  // Webpack 設定：修復 Supabase 在 Cloudflare Workers 的打包問題
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter((external: any) => {
          if (typeof external === 'string') {
            return !external.includes('@supabase');
          }
          return true;
        });
      }
    }
    
    return config;
  },

  // Server 端外部套件設定
  serverExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],
};

export default nextConfig;

// OpenNext 開發環境初始化
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

### 3. 建立 open-next.config.ts

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```

### 4. 更新 wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "outdoor-trails-hub",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": [
    "nodejs_compat",
    "global_fetch_strictly_public"
  ],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "outdoor-trails-hub"
    }
  ],
  "r2_buckets": [
    {
      "binding": "NEXT_INC_CACHE_R2_BUCKET",
      "bucket_name": "outdoor-trails-hub-cache"
    }
  ]
}
```

**重要變更：**
- `main`: 改為 `.open-next/worker.js`
- `assets.directory`: 改為 `.open-next/assets`
- `compatibility_date`: 必須 >= `2024-09-23`
- 新增 `nodejs_compat` 和 `global_fetch_strictly_public` 標誌
- 新增 R2 bucket 綁定

### 5. 更新 .dev.vars

```bash
# Cloudflare Workers 本地開發環境變數
NEXTJS_ENV=development

# 網站網址（正式環境使用）
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 資料庫
DATABASE_URL=your_database_url

# Cloudflare API Token（用於部署）
CLOUDFLARE_API_TOKEN=your_api_token
```

### 6. 建立 public/_headers

```
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
```

### 7. 更新 .gitignore

```gitignore
# OpenNext
.open-next/
```

### 8. 更新 package.json scripts

```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0",
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "upload": "opennextjs-cloudflare build && opennextjs-cloudflare upload",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  }
}
```

---

## ⚠️ 遇到的問題與解決方案

### 問題 1: WSL 環境 Wrangler 平台不匹配

**錯誤訊息：**
```
Error: You installed workerd on another platform than the one you're currently using.
@cloudflare/workerd-windows-64 vs @cloudflare/workerd-linux-64
```

**原因：** 在 Windows 全域安裝的 wrangler 與 WSL (Linux) 環境不相容。

**解決方案：**
```bash
# 使用專案本地的 wrangler，不要使用全域安裝
npx wrangler login
npm run deploy
```

### 問題 2: rclone.js 安裝失敗

**錯誤訊息：**
```
npm error code ETIMEDOUT
npm error path /home/xxx/node_modules/rclone.js
```

**原因：** rclone.js 的 postinstall 腳本在 WSL 環境中網路連線超時。

**解決方案：**
```bash
# 使用 --ignore-scripts 跳過 postinstall
npm install @opennextjs/cloudflare@latest --ignore-scripts
```

### 問題 3: Supabase Vendor Chunks 錯誤

**錯誤訊息：**
```
ENOENT: no such file or directory, open '.next/server/vendor-chunks/@supabase.js'
```

**原因：** Next.js 在打包時無法正確處理 Supabase 套件。

**解決方案：** 在 `next.config.ts` 中添加 webpack 配置（見上方第 2 步）。

### 問題 4: OAuth Redirect 路徑問題

**問題：** 本地開發和正式環境需要不同的 redirect URL。

**解決方案：** 使用環境變數動態設定：

```typescript
// app/auth/callback/route.ts
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  
  // 優先使用環境變數，否則使用 request origin
  let origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
  
  // WSL 環境特殊處理
  if (origin.includes('0.0.0.0')) {
    origin = origin.replace('0.0.0.0', 'localhost')
  }
  
  // ... 其他邏輯
}
```

### 問題 5: Prisma Client 無法找到

**錯誤訊息：**
```
Type error: Module '"@prisma/client"' has no exported member 'PrismaClient'.
```

**原因：** 專案中沒有 `schema.prisma` 檔案，無法生成 Prisma Client。

**暫時解決方案：** 如果不使用資料庫，可以暫時註解掉 Prisma 相關程式碼。

```typescript
// lib/prisma.ts
// TODO: 暫時停用 Prisma
export const prisma = null
export default prisma
```

**長期解決方案：** 建立 `prisma/schema.prisma` 並執行 `npx prisma generate`。

### 問題 6: 部署時缺少環境變數

**問題：** 本地 `.dev.vars` 只用於開發，生產環境沒有環境變數。

**解決方案：** 在 Cloudflare Dashboard 設定環境變數：

1. 前往 **Workers & Pages** → 選擇你的 Worker
2. **Settings** → **Variables**
3. 添加所有必要的環境變數
4. 重新部署

### 問題 7: Supabase Redirect URLs 未設定

**問題：** OAuth callback 失敗，因為 Supabase 不允許該網址。

**解決方案：** 在 Supabase Dashboard 添加允許的 Redirect URLs：

1. **Authentication** → **URL Configuration**
2. **Redirect URLs** 添加：
   - `https://your-domain.com/auth/callback`
   - `https://your-worker.workers.dev/auth/callback`

---

## 📝 重要注意事項

### 本地開發

1. **使用專案本地的 wrangler**
   ```bash
   npx wrangler login
   npm run preview  # 不要用全域的 wrangler
   ```

2. **WSL 環境特殊設定**
   - 使用 `--ignore-scripts` 安裝套件
   - 本地開發用 `npm run dev`（Next.js 開發伺服器）
   - 測試 Workers 環境用 `npm run preview`

3. **環境變數管理**
   - `.dev.vars` 只用於本地開發
   - 不要提交 `.dev.vars` 到 Git
   - 生產環境在 Cloudflare Dashboard 設定

### 部署流程

1. **建立 R2 Bucket（首次部署必做）**
   - 前往 Cloudflare Dashboard → R2
   - 建立 bucket，名稱需與 `wrangler.jsonc` 一致
   - 選擇適當的區域（APAC for 亞洲使用者）

2. **設定環境變數**
   ```
   NEXT_PUBLIC_SITE_URL          # 正式網站網址
   NEXT_PUBLIC_SUPABASE_URL      # Supabase 專案網址
   NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase 公開金鑰
   DATABASE_URL                   # 資料庫連線字串（如需要）
   ```

3. **更新 Supabase Redirect URLs**
   - 添加所有允許的 callback 網址
   - 包含 Workers 網址和自訂網域

4. **部署指令**
   ```bash
   # 本地預覽
   npm run preview
   
   # 部署到 Cloudflare
   npm run deploy
   
   # 上傳新版本（不立即啟用）
   npm run upload
   ```

### 效能優化

1. **R2 快取**
   - 自動快取 ISR/SSG 頁面
   - 減少重複建置時間
   - 降低 Worker 運算成本

2. **靜態資源快取**
   - `public/_headers` 設定永久快取
   - `/_next/static/*` 資源使用 CDN

3. **Bundle 大小優化**
   - 使用 `serverExternalPackages` 排除大型套件
   - Webpack 設定優化打包

### 安全性

1. **API Token 管理**
   - 不要將 API Token 提交到 Git
   - 定期輪換 Token
   - 使用最小權限原則

2. **環境變數保護**
   - 敏感資訊只存在 Cloudflare Dashboard
   - `.dev.vars` 加入 `.gitignore`

3. **Supabase 安全設定**
   - 只允許特定網域的 redirect
   - 啟用 RLS (Row Level Security)
   - 定期審查 Auth 設定

---

## 🎯 部署檢查清單

### 部署前

- [ ] 清理舊建置檔案 (`rm -rf .next .open-next`)
- [ ] 確認所有測試通過
- [ ] 確認環境變數正確設定
- [ ] 本地預覽測試成功 (`npm run preview`)

### Cloudflare 設定

- [ ] R2 Bucket 已建立（名稱：`outdoor-trails-hub-cache`）
- [ ] 環境變數已設定（所有必要變數）
- [ ] Wrangler 已登入或 API Token 正確

### Supabase 設定

- [ ] Redirect URLs 已添加
- [ ] OAuth Providers 已設定
- [ ] RLS 規則已啟用

### 部署後驗證

- [ ] 網站可以正常訪問
- [ ] 靜態頁面載入正常
- [ ] Google OAuth 登入功能正常
- [ ] Dashboard 可以正常訪問
- [ ] 圖片和靜態資源載入正常
- [ ] 監控 Worker 錯誤日誌

---

## 🔍 疑難排解

### 問題：部署後網站無法載入

**檢查項目：**
1. Cloudflare Dashboard → Workers & Pages → 查看部署狀態
2. 檢查 Worker 錯誤日誌
3. 確認 R2 Bucket 綁定正確
4. 驗證環境變數設定

### 問題：OAuth 登入失敗

**檢查項目：**
1. Supabase Redirect URLs 是否包含當前網址
2. 環境變數 `NEXT_PUBLIC_SITE_URL` 是否正確
3. `NEXT_PUBLIC_SUPABASE_*` 環境變數是否設定
4. 檢查 Supabase Auth 日誌

### 問題：圖片無法載入

**檢查項目：**
1. `images.unoptimized: true` 是否已設定
2. 圖片路徑是否正確
3. `public/_headers` 是否存在
4. Cloudflare 快取設定

### 問題：建置失敗

**檢查項目：**
1. 清理建置快取：`rm -rf .next .open-next node_modules/.cache`
2. 重新安裝依賴：`npm install --ignore-scripts`
3. 檢查 TypeScript 錯誤
4. 查看完整錯誤訊息

---

## 📚 參考資源

### 官方文件
- [OpenNext Cloudflare 文件](https://opennext.js.org/cloudflare/get-started)
- [Cloudflare Workers 文件](https://developers.cloudflare.com/workers/)
- [Cloudflare R2 文件](https://developers.cloudflare.com/r2/)
- [Wrangler 配置參考](https://developers.cloudflare.com/workers/wrangler/configuration/)

### 相關問題
- [Next.js on Cloudflare Workers](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Supabase with Edge Functions](https://supabase.com/docs/guides/functions)

---

## 🎉 遷移成功指標

完成遷移後，你應該能夠：

- ✅ 本地開發正常運作（`npm run dev`）
- ✅ Workers 預覽正常（`npm run preview`）
- ✅ 部署成功無錯誤（`npm run deploy`）
- ✅ 網站在 Cloudflare Workers 上運行
- ✅ R2 快取功能啟用
- ✅ Google OAuth 登入正常
- ✅ 所有頁面和 API 正常運作
- ✅ 靜態資源正確快取

---

## 💡 最佳實踐建議

1. **版本控制**
   - 提交前測試本地預覽
   - 使用語意化版本標籤
   - 記錄每次部署的變更

2. **監控與日誌**
   - 定期檢查 Worker 錯誤日誌
   - 監控 R2 使用量和費用
   - 追蹤頁面載入效能

3. **持續優化**
   - 定期更新依賴套件
   - 監控 Bundle 大小
   - 優化建置時間

4. **團隊協作**
   - 文件保持更新
   - 分享遇到的問題和解決方案
   - Code Review 注意環境相關設定

---

**文件維護者：** OutShare Team  
**最後更新：** 2025-10-17  
**適用版本：** Next.js 15.5.2, @opennextjs/cloudflare 1.11.0

