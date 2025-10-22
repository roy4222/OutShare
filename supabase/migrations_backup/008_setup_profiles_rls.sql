-- 設定 Profiles 表的 Row Level Security (RLS) 政策
-- 確保使用者可以建立和管理自己的 profile

-- 啟用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 所有人都可以讀取 profiles（公開）
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles"
ON public.profiles
FOR SELECT
USING (true);

-- 使用者可以插入自己的 profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 使用者可以更新自己的 profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 使用者可以刪除自己的 profile
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- 添加註解
COMMENT ON POLICY "Allow public read access to profiles" ON public.profiles IS '所有人都可以查看 profiles';
COMMENT ON POLICY "Users can insert their own profile" ON public.profiles IS '使用者只能建立自己的 profile';
COMMENT ON POLICY "Users can update their own profile" ON public.profiles IS '使用者只能更新自己的 profile';
COMMENT ON POLICY "Users can delete their own profile" ON public.profiles IS '使用者只能刪除自己的 profile';

