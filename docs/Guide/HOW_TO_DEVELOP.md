# 🚀 開發指南 - 如何查看和管理資料庫

## 📋 目錄
1. [查看資料庫 Tables](#查看資料庫-tables)
2. [啟動開發環境](#啟動開發環境)
3. [常用開發指令](#常用開發指令)
4. [資料庫管理](#資料庫管理)
5. [開發流程](#開發流程)

---

## 🗄️ 查看資料庫 Tables

您有 **3 種方式**可以查看和管理資料：

### 方法 1: Prisma Studio（推薦 ⭐）

**最直觀的視覺化工具**

```bash
npx prisma studio
```

然後開啟瀏覽器：**http://localhost:5555**

**功能**：
- ✅ 視覺化查看所有 tables
- ✅ 直接編輯資料（新增/修改/刪除）
- ✅ 搜尋和篩選
- ✅ 關聯資料自動顯示
- ✅ 即時更新

**適合**：日常開發、測試資料、快速查看

---

### 方法 2: Supabase Studio

**完整的 Supabase 管理介面**

開啟瀏覽器：**http://127.0.0.1:54323**

**功能**：
- ✅ 查看 Tables
- ✅ 管理 Auth users
- ✅ 查看 Storage
- ✅ 執行 SQL queries
- ✅ 查看 API logs

**適合**：管理 Auth、查看 logs、執行複雜 SQL

---

### 方法 3: CLI（命令列）

**快速查詢和腳本**

```bash
# 進入 PostgreSQL
docker exec -it supabase_db_outdoor-trails-hub psql -U postgres -d postgres

# 或使用單行查詢
docker exec supabase_db_outdoor-trails-hub psql -U postgres -d postgres -c "SELECT * FROM public.trip;"
```

**常用 SQL 指令**：

```sql
-- 查看所有 tables
\dt public.*

-- 查看 table 結構
\d public.trip

-- 查詢資料
SELECT * FROM public.trip;
SELECT * FROM public.gear;
SELECT * FROM public.profiles;

-- 查看 Auth users
SELECT id, email, created_at FROM auth.users;

-- 退出
\q
```

**適合**：快速查詢、自動化腳本、批次操作

---

## 🚀 啟動開發環境

### 完整啟動流程

```bash
# 1. 啟動本地 Supabase（如果還沒啟動）
npx supabase start

# 2. 開啟 Prisma Studio（查看資料）
npx prisma studio

# 3. 啟動 Next.js 開發伺服器（另一個終端機）
npm run dev
```

### 現在您可以：

- 📊 **Prisma Studio**: http://localhost:5555
- 🗄️ **Supabase Studio**: http://127.0.0.1:54323
- 🌐 **應用程式**: http://localhost:3000
- 📧 **Mailpit (測試郵件)**: http://127.0.0.1:54324

---

## 🛠️ 常用開發指令

### Supabase 管理

```bash
# 啟動
npx supabase start

# 停止
npx supabase stop

# 查看狀態
npx supabase status

# 重置資料庫（會清空所有資料！）
npx supabase db reset
```

### Prisma 管理

```bash
# 開啟 Studio
npx prisma studio

# 生成 Prisma Client（修改 schema 後）
npx prisma generate

# 從資料庫同步 schema
npx prisma db pull

# 推送 schema 到資料庫
npx prisma db push

# 格式化 schema
npx prisma format
```

### Next.js 開發

```bash
# 啟動開發伺服器
npm run dev

# 建置
npm run build

# 啟動正式環境
npm start

# Lint 檢查
npm run lint
```

---

## 📊 資料庫管理

### 現有的 Tables

```
public.profiles      - 使用者資料
public.trip          - 旅程資料
public.gear          - 裝備資料
public.trip_gear     - 旅程-裝備關聯（多對多）

auth.users           - Supabase Auth 使用者
```

### 查看資料數量

**Prisma Studio**：
- 開啟 http://localhost:5555
- 每個 table 都會顯示資料筆數

**CLI**：
```bash
docker exec supabase_db_outdoor-trails-hub psql -U postgres -d postgres -c "
  SELECT 
    'profiles' as table_name, COUNT(*) FROM public.profiles
  UNION ALL
  SELECT 'trip', COUNT(*) FROM public.trip
  UNION ALL
  SELECT 'gear', COUNT(*) FROM public.gear;
"
```

### 清空特定 table

```bash
docker exec supabase_db_outdoor-trails-hub psql -U postgres -d postgres -c "
  TRUNCATE public.trip CASCADE;
"
```

**⚠️ 注意**：`CASCADE` 會同時刪除關聯資料

### 新增測試資料

**方法 1: Prisma Studio**
1. 開啟 http://localhost:5555
2. 選擇 table (例如 `Trip`)
3. 點擊 **Add record**
4. 填寫資料
5. 點擊 **Save 1 change**

**方法 2: SQL**
```sql
-- 新增旅程
INSERT INTO public.trip (
  id, user_id, title, location, description
) VALUES (
  gen_random_uuid(),
  'your-user-id',
  '測試旅程',
  '測試地點',
  '這是一個測試旅程'
);
```

---

## 🔄 開發流程

### 典型的開發日程

```bash
# 早上開始工作
npx supabase start        # 啟動資料庫
npx prisma studio &       # 開啟 Prisma Studio（背景）
npm run dev              # 啟動開發伺服器

# 開發中...
# - 編輯程式碼
# - 在 Prisma Studio 查看資料
# - 在瀏覽器測試功能

# 晚上結束工作
npx supabase stop         # 停止資料庫（可選，資料會保留）
```

### 修改資料庫 Schema

```bash
# 1. 修改 prisma/schema.prisma
code prisma/schema.prisma

# 2. 生成新的 Prisma Client
npx prisma generate

# 3. 推送變更到資料庫
npx prisma db push

# 4. 重啟開發伺服器
# Ctrl+C 然後 npm run dev
```

### 建立新的 Migration

```bash
# 1. 修改 prisma/schema.prisma

# 2. 建立 migration
npx prisma migrate dev --name add_new_field

# 3. 檢查 supabase/migrations/ 是否有新檔案

# 4. 測試
npx supabase db reset
npx prisma generate
```

---

## 🐛 常見問題

### Q: Prisma Studio 說找不到 DATABASE_URL？

**A**: 確認 `.env` 檔案存在且包含：
```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

如果只有 `.env.local`，請複製：
```bash
echo 'DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"' > .env
```

### Q: Supabase 無法啟動？

**A**: 檢查 Docker 是否正在運行：
```bash
docker ps

# 如果沒有，啟動 Docker Desktop
# 然後再執行
npx supabase start
```

### Q: 資料庫連不上？

**A**: 確認 Supabase 正在運行：
```bash
npx supabase status

# 如果沒有運行
npx supabase start
```

### Q: 想要清空所有資料重新開始？

**A**: 重置資料庫：
```bash
npx supabase db reset

# 然後重新生成 Prisma Client
npx prisma generate
```

---

## 📱 快速參考

### 一鍵啟動（建議）

建立 `start-dev.sh`:
```bash
#!/bin/bash
echo "🚀 啟動開發環境..."
npx supabase start
npx prisma studio &
npm run dev
```

執行：
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### 查看所有 URLs

```bash
npx supabase status | grep "URL"
```

輸出：
```
API URL: http://127.0.0.1:54321
Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
```

加上：
- Prisma Studio: http://localhost:5555
- Next.js App: http://localhost:3000

---

## 🎯 下一步

1. ✅ **查看資料**：開啟 Prisma Studio (http://localhost:5555)
2. ✅ **測試 Auth**：登入應用程式 (http://localhost:3000)
3. ✅ **新增資料**：在 Prisma Studio 中新增測試 Trip 和 Gear
4. ✅ **開發功能**：開始編寫新功能
5. ✅ **查看結果**：在 Prisma Studio 中查看資料變化

---

**現在您可以開始開發了！** 🎉

有任何問題，請查看這份文件或詢問我！

