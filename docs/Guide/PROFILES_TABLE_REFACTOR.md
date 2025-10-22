# 📋 Profiles 表主鍵重構說明

## 🎯 問題說明

### 原始設計（不佳）
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- ❌ 冗餘
  user_id UUID UNIQUE REFERENCES auth.users(id),  -- ✅ 真正的識別碼
  username TEXT UNIQUE,
  ...
);
```

**問題**：
1. ❌ `id` 和 `user_id` 冗餘 - profiles 與 users 是一對一關係
2. ❌ 查詢時需要額外的 JOIN
3. ❌ 不符合 Supabase 官方最佳實踐
4. ❌ 可能導致資料不一致（理論上 id 和 user_id 應該相同）

### 最佳實踐（推薦）
```sql
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),  -- ✅ 直接作為主鍵
  username TEXT UNIQUE,
  ...
);
```

**優點**：
1. ✅ 結構清晰 - 一對一關係一目了然
2. ✅ 查詢簡單 - 直接用 user_id
3. ✅ 無冗餘 - 只有必要的欄位
4. ✅ 符合正規化原則

---

## 🔧 如何套用修正

### 選項 A: 立即套用（推薦用於新專案）

如果您的專案**還沒有重要資料**，可以立即套用：

```bash
# 1. 套用 migration
npx supabase db reset

# 2. 重新生成 Prisma Client
npx prisma generate

# 3. 重啟開發環境
npm run dev
```

### 選項 B: 保留現狀（如果已有資料）

如果您的專案**已有資料**，可以：

1. **保持現狀** - 繼續使用 `id` 作為主鍵
2. **未來重構** - 在適當時機執行 migration

---

## 📝 Migration 內容

我已經建立了 `002_fix_profiles_primary_key.sql`：

```sql
-- 移除舊的主鍵約束
ALTER TABLE public.profiles DROP CONSTRAINT profiles_pkey;

-- 移除冗餘的 id 欄位
ALTER TABLE public.profiles DROP COLUMN id;

-- 將 user_id 設為主鍵
ALTER TABLE public.profiles ADD PRIMARY KEY (user_id);
```

---

## 🔄 需要更新的程式碼

### Prisma Schema（已更新）

**修改前**：
```prisma
model Profile {
  id       String @id @default(dbgenerated("gen_random_uuid()"))
  user_id  String @unique @db.Uuid
  ...
}
```

**修改後**：
```prisma
model Profile {
  user_id  String @id @db.Uuid  // 直接作為主鍵
  ...
}
```

### Prisma Service 查詢（需要更新）

**修改前**：
```typescript
// ❌ 使用 id 查詢
await prisma.profile.findUnique({
  where: { id: profileId }
});

// ✅ 使用 user_id 查詢
await prisma.profile.findUnique({
  where: { user_id: userId }
});
```

**修改後**：
```typescript
// ✅ 直接使用 user_id（現在是主鍵）
await prisma.profile.findUnique({
  where: { user_id: userId }
});
```

**好消息**：我們的程式碼**已經都在使用 `user_id`**，所以不需要修改！

---

## ✅ 檢查清單

讓我檢查專案中是否有使用 `profiles.id` 的地方：

### 1. Prisma Services
```typescript
// lib/services/prisma/profiles.service.ts
// ✅ 已經使用 user_id
export async function getProfileByUserId(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { user_id: userId }  // ✅ 正確
  });
}
```

### 2. API Routes
```typescript
// app/api/profiles/route.ts
// ✅ 已經使用 user.id (= user_id)
const { data, error } = await getProfileByUserId(user.id);  // ✅ 正確
```

### 3. Hooks
```typescript
// lib/hooks/useProfile.ts
// ✅ 使用 API，不直接操作資料庫
const response = await fetch('/api/profiles');  // ✅ 正確
```

**結論**：✅ **所有程式碼已經正確使用 `user_id`，不需要修改！**

---

## 🚀 套用步驟

### 如果您決定套用修正：

#### 步驟 1: 備份現有資料（如果有）
```bash
# 匯出現有 profiles 資料
docker exec supabase_db_outdoor-trails-hub pg_dump \
  -U postgres \
  -d postgres \
  -t public.profiles \
  --data-only \
  > profiles_backup.sql
```

#### 步驟 2: 套用 migration
```bash
# 重置資料庫（會套用所有 migrations）
npx supabase db reset

# 或手動執行 migration
npx supabase migration up
```

#### 步驟 3: 重新生成 Prisma Client
```bash
npx prisma generate
```

#### 步驟 4: 測試
```bash
# 啟動開發環境
npm run dev

# 測試 Google 登入
# 查看 Profile 是否正常建立
```

#### 步驟 5: 驗證
```bash
# 檢查表結構
docker exec supabase_db_outdoor-trails-hub psql -U postgres -d postgres -c "\d public.profiles"

# 應該看到 user_id 是主鍵
```

---

## ⚠️ 注意事項

### 1. RLS 政策
Migration 已包含重新建立 RLS 政策，不需要額外處理。

### 2. 自動建立 Profile 的 Trigger
```sql
-- 001_init_complete_schema.sql 中已有
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)  -- ✅ user_id 作為主鍵
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

✅ Trigger 已經正確使用 `user_id`，不需要修改。

### 3. 現有資料遷移
如果您已有資料且 `id ≠ user_id`，需要額外的資料遷移腳本。

---

## 🎯 建議

### 立即套用（推薦）✅
**如果符合以下條件**：
- ✅ 專案還在開發階段
- ✅ 沒有正式使用者資料
- ✅ 可以重置資料庫

**執行**：
```bash
npx supabase db reset
npx prisma generate
npm run dev
```

### 延後處理（保守）
**如果符合以下條件**：
- ⚠️ 已有正式使用者資料
- ⚠️ 無法停機維護
- ⚠️ 需要更複雜的遷移計畫

**執行**：
- 保持現狀
- 記錄為技術債
- 未來規劃遷移

---

## 📚 參考資料

- [Supabase Auth Schema](https://supabase.com/docs/guides/auth/managing-user-data)
- [PostgreSQL Primary Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

---

## 🎉 總結

**現狀**：
- ✅ 程式碼已經正確使用 `user_id`
- ✅ Migration 已準備好
- ✅ Prisma Schema 已更新

**您可以選擇**：
1. **立即套用** - `npx supabase db reset`（推薦）
2. **保持現狀** - 繼續開發，未來再處理

**我的建議**：
如果專案還在開發階段，**立即套用**修正，可以避免未來的技術債。

---

**需要我幫您套用嗎？** 🚀

