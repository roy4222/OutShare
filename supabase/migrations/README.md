# Supabase Migrations

## 📁 目錄結構

```
supabase/migrations/
├── 001_init_complete_schema.sql  # ⭐ 唯一的 migration 檔案（已整理）
└── migrations_backup/            # 舊的混亂 migrations（已備份）
```

## ✨ 最新狀態（2025-10-21）

**所有 migrations 已合併為單一檔案：`001_init_complete_schema.sql`**

這個檔案包含：
1. ✅ 所有表結構（profiles, trip, gear, trip_gear）
2. ✅ 所有索引
3. ✅ Row Level Security (RLS) 政策
4. ✅ Auto Profile Trigger（新使用者註冊時自動建立 profile）
5. ✅ 完整的測試資料

---

## 🔄 Migration 內容

### 第一部分：表結構
- `profiles` - 使用者個人資料
- `trip` - 旅程記錄
- `gear` - 裝備
- `trip_gear` - 旅程與裝備的多對多關聯

### 第二部分：索引
所有常用查詢欄位都已建立索引（user_id, username, slug, category 等）

### 第三部分：RLS 政策
- **公開讀取**：所有表都允許公開讀取
- **擁有者權限**：只有擁有者可以新增/修改/刪除自己的資料

### 第四部分：Triggers
- `handle_new_user()` - 當新使用者註冊時，自動在 profiles 表建立對應記錄

### 第五部分：測試資料
- 1 個示範使用者（`demo_user`）
- 2 個旅程（熊野古道、玉山主峰）
- 5 個裝備（帳篷、睡袋、背包、頭燈、登山杖）
- 5 個旅程-裝備關聯

---

## 🚀 如何使用

### 重置資料庫（重新執行 migration）
```bash
npx supabase db reset
```

### 啟動本地 Supabase
```bash
npx supabase start
```

### 停止本地 Supabase
```bash
npx supabase stop
```

### 檢查狀態
```bash
npx supabase status
```

---

## 📊 驗證資料

啟動後可執行以下指令檢查資料：

```bash
docker exec supabase_db_outdoor-trails-hub psql -U postgres -d postgres -c "
SELECT COUNT(*) as profiles FROM public.profiles;
SELECT COUNT(*) as trips FROM public.trip;
SELECT COUNT(*) as gear FROM public.gear;
SELECT COUNT(*) as relations FROM public.trip_gear;
"
```

預期結果：
- profiles: 1
- trips: 2
- gear: 5
- relations: 5

---

## 📦 備份說明

舊的 migrations（來回修正的混亂版本）已備份至：
```
supabase/migrations_backup/
├── 000_create_base_tables.sql
├── 001_create_trip_gear_table.sql
├── 002_add_trip_slug.sql
├── 003_seed_initial_data.sql
├── 004_setup_rls_policies.sql
├── 005_add_gear_dashboard_title.sql
├── 006_auto_create_profile.sql
├── 007_fix_profiles_table.sql
├── 008_setup_profiles_rls.sql
├── 009_move_dashboard_title_to_profiles.sql
└── 010_auto_create_profile_trigger.sql
```

**⚠️ 這些檔案僅供參考，不會被執行。**

---

## 🔄 下一步

現在您可以：
1. ✅ 使用 `npx prisma db pull` 從資料庫生成 Prisma schema
2. ✅ 開始開發 Prisma services（Phase 2）
3. ✅ 更新 React Hooks（Phase 3）

---

## 💡 提示

如果您需要修改 schema：
1. 直接編輯 `001_init_complete_schema.sql`
2. 執行 `npx supabase db reset` 重新套用
3. 或者建立新的 migration 檔案（如 `002_add_new_feature.sql`）

---

**整理完成！現在資料庫結構清晰乾淨了！** 🎉

