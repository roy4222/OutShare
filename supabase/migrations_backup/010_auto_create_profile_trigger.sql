-- 自動建立 Profile Trigger
-- 當新使用者在 auth.users 註冊時，自動在 public.profiles 建立對應記錄

-- ============================================
-- 1. 建立 Trigger 函數
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,  -- 暫時使用 email 作為 username
    NULL,       -- display_name 之後由使用者自行設定
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- ============================================
-- 2. 建立 Trigger
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. 為現有使用者補建 Profile（如果有的話）
-- ============================================

INSERT INTO public.profiles (user_id, username, display_name, created_at, updated_at)
SELECT 
  id,
  email,
  NULL,
  created_at,
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- 4. 註解說明
-- ============================================

COMMENT ON FUNCTION public.handle_new_user() IS '當新使用者註冊時，自動在 profiles 表建立對應記錄';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS '自動建立 profile 的 trigger';




