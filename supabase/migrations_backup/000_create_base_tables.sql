-- 初始化資料庫 Schema
-- 建立所有基礎表格

-- ============================================
-- 1. 建立 profiles 表
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  social_links jsonb DEFAULT '{}'::jsonb,
  gear_dashboard_title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 2. 建立 trip 表
-- ============================================

CREATE TABLE IF NOT EXISTS public.trip (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  slug text UNIQUE,
  title text NOT NULL,
  description text,
  location text,
  duration text,
  date date,
  images text[] DEFAULT ARRAY[]::text[],
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 3. 建立 gear 表
-- ============================================

CREATE TABLE IF NOT EXISTS public.gear (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  category text,
  description text,
  image_url text,
  specs jsonb,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 4. 建立索引
-- ============================================

-- Profiles 索引
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- Trip 索引
CREATE INDEX IF NOT EXISTS trip_user_id_idx ON public.trip(user_id);
CREATE INDEX IF NOT EXISTS trip_slug_idx ON public.trip(slug);
CREATE INDEX IF NOT EXISTS trip_created_at_idx ON public.trip(created_at DESC);

-- Gear 索引
CREATE INDEX IF NOT EXISTS gear_user_id_idx ON public.gear(user_id);
CREATE INDEX IF NOT EXISTS gear_category_idx ON public.gear(category);

-- ============================================
-- 5. 註解說明
-- ============================================

COMMENT ON TABLE public.profiles IS '使用者個人資料';
COMMENT ON TABLE public.trip IS '戶外旅程記錄';
COMMENT ON TABLE public.gear IS '戶外裝備';

COMMENT ON COLUMN public.profiles.user_id IS '關聯到 auth.users 的 ID';
COMMENT ON COLUMN public.profiles.gear_dashboard_title IS '裝備儀表板自訂標題';
COMMENT ON COLUMN public.trip.slug IS 'URL 友善的唯一識別碼';
COMMENT ON COLUMN public.trip.tags IS '旅程標籤（如 #登山 #露營）';
COMMENT ON COLUMN public.gear.specs IS 'JSON 格式的裝備規格';

