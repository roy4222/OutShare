# Supabase Migrations - 資料遷移指南

## 📋 Migration 檔案說明

### 001_create_trip_gear_table.sql
建立 `trip_gear` 中間表，用於處理旅程與裝備的多對多關聯。

### 002_add_trip_slug.sql
為 `trip` 表添加 `slug` 欄位，用於保留原有的字串 ID（如 `Kumano_Kodo`），方便 URL 使用。

### 003_seed_initial_data.sql
將靜態資料（`data/trips.ts` 和 `data/equiment.ts`）匯入到 Supabase。
- 插入測試使用者（UUID: `00000000-0000-0000-0000-000000000001`）
- 插入 4 個旅程
- 插入 12 個裝備
- 建立 trip_gear 關聯

### 004_setup_rls_policies.sql
設定 Row Level Security (RLS) 政策：
- 所有人可讀取公開資料
- 只有擁有者可以修改自己的資料

## 🚀 如何執行 Migrations

### 方法 1：透過 Supabase Dashboard（推薦）

1. 登入 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案
3. 進入 **SQL Editor**
4. 依序複製並執行以下檔案的內容：
   - `001_create_trip_gear_table.sql`
   - `002_add_trip_slug.sql`
   - `003_seed_initial_data.sql`
   - `004_setup_rls_policies.sql`

### 方法 2：使用 Supabase CLI

如果你有安裝 Supabase CLI：

```bash
# 初始化 Supabase（如果還沒做過）
supabase init

# 連結到你的專案
supabase link --project-ref <your-project-ref>

# 執行所有 migrations
supabase db push

# 或者單獨執行特定檔案
psql -h <your-db-host> -U postgres -d postgres -f supabase/migrations/001_create_trip_gear_table.sql
```

### 方法 3：使用 psql 直接連線

```bash
# 取得連線字串：Supabase Dashboard -> Settings -> Database -> Connection string
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxx.supabase.co:5432/postgres"

# 在 psql 中執行
\i supabase/migrations/001_create_trip_gear_table.sql
\i supabase/migrations/002_add_trip_slug.sql
\i supabase/migrations/003_seed_initial_data.sql
\i supabase/migrations/004_setup_rls_policies.sql
```

## ⚠️ 重要注意事項

### 1. 測試使用者 ID
- 在 `003_seed_initial_data.sql` 中，我們使用了固定的測試使用者 UUID：
  ```
  00000000-0000-0000-0000-000000000001
  ```
- **正式環境部署前**，請：
  1. 透過 Supabase Auth 建立真實使用者
  2. 取得該使用者的 UUID
  3. 修改 `003_seed_initial_data.sql` 中的 `user_id` 值

### 2. 執行順序
- 必須按照檔案編號順序執行（001 → 002 → 003 → 004）
- 因為後面的檔案可能依賴前面建立的結構

### 3. 冪等性（Idempotent）
- 所有 migration 檔案都設計為冪等的（可重複執行）
- 使用 `IF NOT EXISTS`、`ON CONFLICT DO NOTHING` 等語法
- 重複執行不會造成錯誤或重複資料

### 4. RLS 政策
- 執行完 `004_setup_rls_policies.sql` 後，所有資料將受到 RLS 保護
- 未登入的使用者只能讀取資料，無法修改
- 登入使用者只能修改自己的資料

## 🔍 驗證 Migration 是否成功

執行以下 SQL 來驗證：

```sql
-- 檢查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('trip', 'gear', 'trip_gear');

-- 檢查資料數量
SELECT 'trips' as table_name, COUNT(*) FROM trip
UNION ALL
SELECT 'gear', COUNT(*) FROM gear
UNION ALL
SELECT 'trip_gear', COUNT(*) FROM trip_gear;

-- 檢查 RLS 是否啟用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('trip', 'gear', 'trip_gear');
```

預期結果：
- 3 個表都存在
- trips: 4 筆
- gear: 12 筆
- trip_gear: 約 40+ 筆（根據關聯）
- 所有表的 rowsecurity 都是 `true`

## 🔄 Rollback（回滾）

如果需要回滾 migrations：

```sql
-- 刪除 RLS 政策
DROP POLICY IF EXISTS "Allow public read access to trips" ON trip;
DROP POLICY IF EXISTS "Users can insert their own trips" ON trip;
-- ... 其他政策

-- 刪除資料
DELETE FROM trip_gear;
DELETE FROM gear;
DELETE FROM trip;
DELETE FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001';

-- 刪除欄位
ALTER TABLE trip DROP COLUMN IF EXISTS slug;

-- 刪除表
DROP TABLE IF EXISTS trip_gear;
```

## 📚 相關文件

- [Supabase RLS 文檔](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html)
- [專案資料庫架構](../../docs/database-schema.md)

## 🆘 常見問題

### Q: Migration 執行失敗怎麼辦？
A: 檢查錯誤訊息，通常是因為：
- 表已經存在（可以忽略，因為使用了 `IF NOT EXISTS`）
- 外鍵約束失敗（檢查 profiles 表是否存在）
- 權限不足（確認使用 postgres 角色）

### Q: 如何更新資料？
A: 修改 `003_seed_initial_data.sql`，然後重新執行。由於使用了 `ON CONFLICT DO NOTHING`，不會覆蓋現有資料。如果要更新，請改用 `ON CONFLICT DO UPDATE`。

### Q: 如何新增更多資料？
A: 建立新的 migration 檔案（如 `005_add_more_data.sql`），遵循相同的格式。

