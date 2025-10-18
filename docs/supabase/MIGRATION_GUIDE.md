# 🚀 Supabase 資料遷移完成指南

## ✅ 已完成的工作

### 1. 資料庫結構 (Migrations)
已建立以下 SQL migration 檔案於 `supabase/migrations/`：

- ✅ `001_create_trip_gear_table.sql` - 建立 trip_gear 中間表
- ✅ `002_add_trip_slug.sql` - 為 trip 表添加 slug 欄位
- ✅ `003_seed_initial_data.sql` - 匯入初始資料（4 個旅程、12 個裝備）
- ✅ `004_setup_rls_policies.sql` - 設定 RLS 安全政策

### 2. 資料存取層
已建立 Supabase 服務層於 `lib/services/supabase/`：

- ✅ `mapper.ts` - 資料轉換函式（DB Row → Domain Model）
- ✅ `equipment.service.ts` - 裝備資料查詢服務
- ✅ `trips.service.ts` - 旅程資料查詢服務
- ✅ `index.ts` - 統一匯出

### 3. React Hooks
已更新/建立以下 hooks：

- ✅ `useEquipment.ts` - 從 Supabase 獲取裝備資料（已更新）
- ✅ `useTripStats.ts` - 從 Supabase 計算旅程統計（已更新）
- ✅ `useTrips.ts` - 從 Supabase 獲取旅程列表（新建）

### 4. 前端組件
已更新以下組件：

- ✅ `app/profile/page.tsx` - 使用新的 useTrips hook
- ✅ `components/features/trips/TripList.tsx` - 簡化邏輯
- ✅ `components/features/trips/TripItemWithStats.tsx` - 新建組件處理統計

### 5. 靜態資料檔案
已標記為廢棄但保留作為備份：

- ✅ `data/trips.ts` - 已加註解說明已遷移
- ✅ `data/equiment.ts` - 已加註解說明已遷移

## 📋 接下來你需要做的事

### 步驟 1: 執行 Migrations

**選項 A：透過 Supabase Dashboard（最簡單）**

1. 登入 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇你的專案
3. 點選左側選單的 **SQL Editor**
4. 依序執行以下檔案（複製貼上內容後點 Run）：
   ```
   supabase/migrations/001_create_trip_gear_table.sql
   supabase/migrations/002_add_trip_slug.sql
   supabase/migrations/003_seed_initial_data.sql
   supabase/migrations/004_setup_rls_policies.sql
   ```

**選項 B：使用 Supabase CLI**

```bash
# 如果還沒安裝 CLI
npm install -g supabase

# 連結到你的專案
supabase link --project-ref <your-project-ref>

# 執行所有 migrations
supabase db push
```

### 步驟 2: 驗證資料

執行以下 SQL 來確認資料已正確匯入：

```sql
-- 檢查資料數量
SELECT 'trips' as table_name, COUNT(*) as count FROM trip
UNION ALL
SELECT 'gear', COUNT(*) FROM gear
UNION ALL
SELECT 'trip_gear', COUNT(*) FROM trip_gear;
```

預期結果：
- trips: 4 筆
- gear: 12 筆
- trip_gear: 約 40+ 筆

### 步驟 3: （可選）更新測試使用者

目前資料使用的是測試使用者 ID：
```
00000000-0000-0000-0000-000000000001
```

**正式環境部署前，建議：**

1. 透過 Supabase Auth 建立真實使用者
2. 取得該使用者的 UUID
3. 更新資料庫中的 user_id：

```sql
-- 假設你的真實使用者 UUID 是 abc123...
UPDATE trip SET user_id = 'abc123...' 
WHERE user_id = '00000000-0000-0000-0000-000000000001';

UPDATE gear SET user_id = 'abc123...' 
WHERE user_id = '00000000-0000-0000-0000-000000000001';

UPDATE profiles SET id = 'abc123...' 
WHERE id = '00000000-0000-0000-0000-000000000001';
```

### 步驟 4: 重新生成 Database Types（可選但推薦）

執行後，trip_gear 表會加入到型別定義中：

```bash
npx supabase gen types typescript --project-id <your-project-id> > lib/database.types.ts
```

### 步驟 5: 測試應用程式

啟動開發伺服器並測試功能：

```bash
npm run dev
```

**測試項目：**
- ✅ 旅程列表是否正確顯示
- ✅ 裝備列表是否正確顯示
- ✅ 旅程統計資料（重量、價格）是否正確
- ✅ Loading 狀態是否正常顯示
- ✅ 錯誤處理是否正常

### 步驟 6: 檢查 Console 是否有錯誤

打開瀏覽器的開發者工具，確認沒有以下錯誤：
- ❌ Supabase 連線錯誤
- ❌ 資料查詢錯誤
- ❌ TypeScript 型別錯誤

## 🔧 troubleshooting

### 問題 1: 「Supabase URL or Key is missing」

**解決方法：**
確認 `.env.local` 中有設定：
```env
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 問題 2: 「RLS policy violation」

**原因：** Row Level Security 阻擋了查詢

**解決方法：**
1. 確認 `004_setup_rls_policies.sql` 已執行
2. 檢查 RLS 政策是否正確：
```sql
SELECT * FROM pg_policies WHERE tablename IN ('trip', 'gear', 'trip_gear');
```

### 問題 3: 資料查詢返回空陣列

**可能原因：**
1. Migrations 未執行或失敗
2. user_id 不匹配（如果有設定使用者過濾）

**檢查方法：**
```sql
-- 直接查詢資料庫
SELECT * FROM trip LIMIT 5;
SELECT * FROM gear LIMIT 5;
```

### 問題 4: Loading 狀態一直顯示

**可能原因：**
1. Supabase 連線問題
2. 查詢邏輯錯誤

**檢查方法：**
打開 Network tab，查看是否有 Supabase API 請求失敗。

## 📊 資料庫架構圖

```
┌─────────────┐
│  profiles   │
│  (使用者)   │
└──────┬──────┘
       │
       │ user_id (FK)
       │
   ┌───┴────────────────┐
   │                    │
┌──▼──────┐      ┌──────▼──┐
│  trip   │      │  gear   │
│ (旅程)  │      │ (裝備)  │
└──┬──────┘      └──────┬──┘
   │                    │
   │ trip_id (FK)       │ gear_id (FK)
   │                    │
   └──────┬─────────────┘
          │
     ┌────▼────────┐
     │ trip_gear   │
     │ (關聯表)    │
     └─────────────┘
```

## 🎯 架構改進

### 優點
1. **可擴展性** - 資料存在資料庫，容易管理和更新
2. **多使用者支援** - 每個使用者可以有自己的旅程和裝備
3. **關聯查詢** - 透過 trip_gear 表，可以彈性管理裝備與旅程的關係
4. **安全性** - RLS 確保使用者只能修改自己的資料
5. **效能** - 使用索引和 JOIN 查詢，效能優於前端過濾

### 與舊架構的差異

| 項目 | 舊架構 | 新架構 |
|------|--------|--------|
| 資料來源 | 靜態檔案 | Supabase 資料庫 |
| 關聯方式 | 字串陣列匹配 title | trip_gear 中間表 |
| 使用者資料 | 無區分 | 每個使用者獨立 |
| 更新方式 | 修改程式碼 | 資料庫操作 |
| 查詢效能 | 前端過濾 | 資料庫查詢 |

## 📚 相關文件

- [Migration README](../supabase/migrations/README.md) - Migrations 詳細說明
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [專案架構文件](./README.md)

## 🤝 需要幫助？

如果遇到問題：
1. 檢查 [supabase/migrations/README.md](../supabase/migrations/README.md) 的常見問題
2. 查看 Supabase Dashboard 的 Logs
3. 檢查瀏覽器 Console 的錯誤訊息

---

**遷移完成日期：** 2025-10-18  
**版本：** 1.0.0  
**負責人：** AI Assistant

