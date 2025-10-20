-- 自動為新註冊使用者建立 profile
-- 當使用者在 auth.users 註冊時，自動在 public.profiles 建立對應記錄

-- 建立觸發器函數
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (
    NEW.id,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 建立觸發器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 添加註解
COMMENT ON FUNCTION public.handle_new_user() IS '當新使用者註冊時，自動在 profiles 表建立對應記錄';

