# ⚡ OpenNext Cloudflare 快速參考

> 快速查詢常用指令和解決方案

---

## 📋 常用指令

### 本地開發
```bash
# Next.js 開發伺服器（推薦日常開發）
npm run dev

# Cloudflare Workers 預覽（測試部署前）
npm run preview

# 清理建置檔案
rm -rf .next .open-next
```

### 部署
```bash
# 登入 Cloudflare（首次）
npx wrangler login

# 部署到 Cloudflare Workers
npm run deploy

# 上傳新版本（不立即啟用）
npm run upload
```

### 套件管理
```bash
# 安裝依賴（WSL 環境）
npm install --ignore-scripts

# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install --ignore-scripts
```

---

## 🔥 快速修復

### 問題 1: WSL Wrangler 錯誤
```bash
# ❌ 不要用全域 wrangler
wrangler login

# ✅ 使用專案本地的
npx wrangler login
```

### 問題 2: 安裝依賴失敗
```bash
# ✅ 加上 --ignore-scripts
npm install --ignore-scripts
```

### 問題 3: Supabase 打包錯誤
確認 `next.config.ts` 有這段：
```typescript
serverExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],
```

### 問題 4: OAuth Redirect 錯誤
1. 設定環境變數 `NEXT_PUBLIC_SITE_URL`
2. 在 Supabase 添加 Redirect URL

### 問題 5: 部署後網站無法載入
檢查 Cloudflare Dashboard：
1. 環境變數是否設定
2. R2 Bucket 是否建立
3. Worker 錯誤日誌

---

## ✅ 部署檢查清單

**部署前：**
- [ ] `rm -rf .next .open-next` 清理舊檔案
- [ ] `npm run preview` 本地測試成功
- [ ] R2 Bucket 已建立
- [ ] 環境變數已準備

**Cloudflare 設定：**
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] R2 Bucket 綁定正確

**Supabase 設定：**
- [ ] Redirect URLs 已添加
- [ ] OAuth Provider 已設定

**部署後：**
- [ ] 網站可訪問
- [ ] Google 登入正常
- [ ] 檢查 Worker 日誌無錯誤

---

## 🔗 重要連結

- [完整遷移指南](./OPENNEXT_CLOUDFLARE_MIGRATION.md)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Supabase Dashboard](https://app.supabase.com/)
- [OpenNext 文件](https://opennext.js.org/cloudflare/)

---

## 💡 關鍵要點

1. **WSL 環境**：永遠使用 `npx wrangler` 而不是全域 wrangler
2. **安裝套件**：使用 `--ignore-scripts` 避免 rclone.js 問題
3. **環境變數**：`.dev.vars` 只用於本地，生產在 Cloudflare Dashboard 設定
4. **R2 Bucket**：首次部署前必須先建立
5. **Supabase URL**：記得在 Supabase 添加所有 redirect URLs

---

**快速參考版本：** 1.0  
**最後更新：** 2025-10-17

