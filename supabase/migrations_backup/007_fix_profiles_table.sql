-- 修正 profiles 表結構
-- 1. 新增 updated_at 欄位
-- 2. 將 username 和 social_links 改為可選（NULLABLE）
-- 3. 修改預設值

-- 新增 updated_at 欄位
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 修改 username 為可選
ALTER TABLE public.profiles 
ALTER COLUMN username DROP NOT NULL;

-- 修改 social_links 為可選並設定預設值
ALTER TABLE public.profiles 
ALTER COLUMN social_links DROP NOT NULL,
ALTER COLUMN social_links SET DEFAULT '{}'::jsonb;

-- 新增 full_name 欄位（可選，用於顯示名稱）
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text;

-- 添加註解
COMMENT ON COLUMN public.profiles.updated_at IS '使用者資料最後更新時間';
COMMENT ON COLUMN public.profiles.username IS '使用者名稱（可選，用於 URL）';
COMMENT ON COLUMN public.profiles.full_name IS '使用者全名（可選）';
COMMENT ON COLUMN public.profiles.social_links IS '社交媒體連結（JSON 格式）';

