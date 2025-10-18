# ✅ Supabase 遷移檢查清單

## 📋 遷移前準備

- [x] 已建立 Supabase 專案
- [x] 已設定環境變數（.env.local）
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] 已有 profiles 表
- [x] 已有 gear 表
- [x] 已有 trip 表

## 🛠️ Migration 執行

### 步驟 1: 建立資料庫結構
- [ ] 執行 `001_create_trip_gear_table.sql`
- [ ] 執行 `002_add_trip_slug.sql`

### 步驟 2: 匯入資料
- [ ] 執行 `003_seed_initial_data.sql`

### 步驟 3: 設定安全政策
- [ ] 執行 `004_setup_rls_policies.sql`

## 🔍 驗證資料

- [ ] 確認 trip_gear 表已建立
- [ ] 確認 trip 表有 slug 欄位
- [ ] 確認有 4 筆旅程資料
- [ ] 確認有 12 筆裝備資料
- [ ] 確認有 40+ 筆 trip_gear 關聯
- [ ] 確認 RLS 已啟用

## 🧪 測試應用程式

### 前端功能測試
- [ ] 旅程列表正確顯示
- [ ] 裝備列表正確顯示
- [ ] 點擊旅程卡片打開詳情
- [ ] 旅程統計資料正確（重量、價格）
- [ ] Loading 狀態正常顯示
- [ ] 圖片正確載入

### 錯誤處理測試
- [ ] 無網路時顯示錯誤訊息
- [ ] 無資料時顯示空狀態
- [ ] Console 無錯誤訊息

## 📱 跨瀏覽器測試（選擇性）
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 🚀 部署前檢查（選擇性）

- [ ] 更新測試使用者為真實使用者
- [ ] 重新生成 database.types.ts
- [ ] 執行完整測試套件
- [ ] 檢查生產環境變數設定

## 📝 文件確認

- [ ] 已閱讀 MIGRATION_QUICK_START.md
- [ ] 已閱讀 docs/MIGRATION_GUIDE.md
- [ ] 已閱讀 supabase/migrations/README.md
- [ ] 已了解 RLS 政策設定

## 🎯 完成標記

**遷移開始時間：** ___________

**遷移完成時間：** ___________

**遷移執行人：** ___________

**遇到的問題：**
- 
- 
- 

**解決方案：**
- 
- 
- 

**備註：**
- 
- 
- 

---

## ✨ 恭喜完成遷移！

你的應用程式現在使用 Supabase 作為資料來源，享受以下優勢：
- ✅ 可擴展的資料庫架構
- ✅ 即時資料更新
- ✅ 內建身份驗證
- ✅ Row Level Security 保護
- ✅ 多使用者支援

**下一步建議：**
1. 監控 Supabase Dashboard 的資料庫使用情況
2. 設定自動備份
3. 優化查詢效能（如有需要）
4. 添加更多功能（如編輯、刪除）

**需要幫助？** 參考 docs/MIGRATION_GUIDE.md 的 troubleshooting 章節。

