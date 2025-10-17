# 🔧 Cloudflare Pages 部署修正指南

## 問題診斷

你遇到的錯誤：
```
The directory specified by the "assets.directory" field in your configuration file does not exist: /opt/buildhome/repo/out
```

**原因：** Cloudflare Pages 在執行標準的 Next.js build，但需要執行 `@cloudflare/next-on-pages` 的建置。

## ✅ 解決方案

### 方案 1：修改 Cloudflare Pages 設定（推薦）

#### 步驟 1: 刪除現有專案

1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Workers & Pages** → 選擇你的專案
3. **Settings** → **Delete deployment**

#### 步驟 2: 重新建立專案（正確設定）

1. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. 選擇 repository: `roy4222/OutShare`
3. **Build settings（重要！）：**

| 設定 | 值 |
|------|---|
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | `.vercel/output/static` |
| Root directory | （留空） |

⚠️ **關鍵：** 
- 不要選擇 "Next.js" preset
- Build command 現在是 `npm run build`（已包含 @cloudflare/next-on-pages）

#### 步驟 3: 設定環境變數

添加以下變數（所有環境）：

```
NEXT_PUBLIC_SUPABASE_URL = 你的值
NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的值
```

#### 步驟 4: 部署

點擊 **Save and Deploy**

---

### 方案 2：使用 wrangler.json 配置

如果你想使用配置檔案，建立 `wrangler.json`：

**wrangler.json:**
```json
{
  "build": {
    "command": "npm run build",
    "cwd": ".",
    "watch_dir": "src"
  },
  "pages_build_output_dir": ".vercel/output/static"
}
```

然後推送到 GitHub，Cloudflare Pages 會自動讀取。

---

## 🚀 推送修正後的程式碼

```bash
git add .
git commit -m "fix: update Cloudflare Pages build configuration"
git push origin main
```

---

## 📋 完整檢查清單

部署前確認：

- [ ] `package.json` 的 `build` script 是：
  ```json
  "build": "next build && npx @cloudflare/next-on-pages"
  ```

- [ ] Cloudflare Pages 設定：
  - [ ] Framework preset: **None**
  - [ ] Build command: `npm run build`
  - [ ] Build output directory: `.vercel/output/static`

- [ ] 環境變數已設定（所有環境）：
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- [ ] `next.config.ts` 沒有 `output: 'export'`

---

## 🎯 預期的建置日誌

成功的建置應該看到：

```
✓ Compiled successfully in 6.3s
✓ Generating static pages (7/7)

⚡️ @cloudflare/next-on-pages CLI v.1.13.16
✨ Detected a Next.js build
✨ Compiled Worker successfully
✨ Build completed!
```

---

## ⚠️ 注意事項

### @cloudflare/next-on-pages 已棄用警告

你可能會看到：
```
npm warn deprecated @cloudflare/next-on-pages@1.13.16: 
Please use the OpenNext adapter instead
```

**這是正常的！** 雖然顯示棄用警告，但目前仍然可以正常使用。

**未來計畫：** Cloudflare 推薦遷移到 [OpenNext](https://opennext.js.org/cloudflare)，但目前 `@cloudflare/next-on-pages` 仍然是官方支援的方案。

---

## 🆘 如果還是失敗

### 檢查 1: 確認建置輸出

在 Cloudflare Pages 建置日誌中，應該看到：

```
✓ Compiled successfully
⚡️ @cloudflare/next-on-pages CLI
✨ Compiled Worker successfully
```

### 檢查 2: 本地測試（WSL 或 Linux）

如果有 WSL 或 Linux 環境：

```bash
npm run build
```

確認會生成 `.vercel/output/static` 目錄。

### 檢查 3: 驗證 Next.js 配置

`next.config.ts` 應該是：

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

**不應該有：**
- ❌ `output: 'export'`
- ❌ `trailingSlash: true`

---

## 📞 需要幫助？

如果問題仍然存在：

1. 查看完整的建置日誌
2. 確認上述所有檢查清單都正確
3. 嘗試在 Cloudflare Pages Dashboard 手動重新部署

---

**修正後再試一次部署，應該就可以成功了！** 🎉

