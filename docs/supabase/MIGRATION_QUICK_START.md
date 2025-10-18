# 🚀 快速開始 - Supabase 遷移

## 三步驟完成遷移

### 1️⃣ 執行 Migrations (5 分鐘)

**前往 [Supabase Dashboard](https://app.supabase.com/) → SQL Editor**

依序執行以下 4 個檔案的內容（複製→貼上→Run）：

```
✅ supabase/migrations/001_create_trip_gear_table.sql
✅ supabase/migrations/002_add_trip_slug.sql
✅ supabase/migrations/003_seed_initial_data.sql
✅ supabase/migrations/004_setup_rls_policies.sql
```

### 2️⃣ 驗證資料 (1 分鐘)

在 SQL Editor 執行：

```sql
SELECT 'trips' as table_name, COUNT(*) as count FROM trip
UNION ALL
SELECT 'gear', COUNT(*) FROM gear
UNION ALL
SELECT 'trip_gear', COUNT(*) FROM trip_gear;
```

**預期結果：**
- trips: 4
- gear: 12
- trip_gear: 40+

### 3️⃣ 測試應用 (2 分鐘)

```bash
npm run dev
```

**檢查項目：**
- ✅ 旅程列表顯示
- ✅ 裝備列表顯示
- ✅ 統計資料正確
- ✅ 無 Console 錯誤

## ✅ 完成！

你的資料已成功遷移到 Supabase。

---

**詳細文件：** [docs/MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md)  
**Migrations 說明：** [supabase/migrations/README.md](supabase/migrations/README.md)

**需要幫助？** 查看完整遷移指南了解更多細節。

