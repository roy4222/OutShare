-- ============================================
-- Migration: 修正 profiles 表的主鍵設計
-- ============================================
-- 
-- 目的：將 profiles.user_id 設為主鍵，移除冗餘的 id 欄位
-- 
-- 原因：
-- 1. profiles 與 auth.users 是一對一關係
-- 2. user_id 應該就是主鍵，不需要額外的 id
-- 3. 符合 Supabase 官方最佳實踐
-- 
-- 影響：
-- - 需要更新所有引用 profiles.id 的外鍵
-- - 需要更新應用程式碼中的查詢
-- 
-- ============================================

BEGIN;

-- 步驟 1: 移除舊的主鍵約束
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;

-- 步驟 2: 移除 id 欄位（如果有資料，會保留 user_id）
ALTER TABLE public.profiles DROP COLUMN IF EXISTS id;

-- 步驟 3: 將 user_id 設為主鍵
ALTER TABLE public.profiles ADD PRIMARY KEY (user_id);

-- 步驟 4: 確保 user_id 的外鍵約束存在
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- 步驟 5: 確保 username 的唯一性約束
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_username_key;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_username_key 
  UNIQUE (username);

COMMIT;

-- ============================================
-- 驗證修改（已註解，這些是互動式命令）
-- ============================================
-- 
-- 如需驗證，請手動執行以下命令：
-- 
-- 1. 查看新的表結構：
--    \d public.profiles;
-- 
-- 2. 顯示主鍵資訊：
--    SELECT tc.constraint_name, tc.table_name, kcu.column_name
--    FROM information_schema.table_constraints AS tc 
--    JOIN information_schema.key_column_usage AS kcu
--      ON tc.constraint_name = kcu.constraint_name
--    WHERE tc.table_name = 'profiles' 
--      AND tc.constraint_type = 'PRIMARY KEY';
