-- ============================================
-- Outdoor Trails Hub - 完整初始化 Schema
-- 合併所有 migrations 為單一檔案
-- ============================================
-- 建立日期: 2025-10-21
-- 包含: 表結構、索引、RLS 政策、Triggers、測試資料

-- ============================================
-- 第一部分：建立表結構
-- ============================================

-- 1. Profiles 表（使用者個人資料）
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

-- 2. Trip 表（旅程記錄）
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

-- 3. Gear 表（裝備）
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

-- 4. Trip_Gear 關聯表（多對多）
CREATE TABLE IF NOT EXISTS public.trip_gear (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  gear_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT trip_gear_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trip(id) ON DELETE CASCADE,
  CONSTRAINT trip_gear_gear_id_fkey FOREIGN KEY (gear_id) REFERENCES public.gear(id) ON DELETE CASCADE,
  CONSTRAINT trip_gear_unique UNIQUE (trip_id, gear_id)
);

-- ============================================
-- 第二部分：建立索引
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

-- Trip_Gear 索引
CREATE INDEX IF NOT EXISTS trip_gear_trip_id_idx ON public.trip_gear(trip_id);
CREATE INDEX IF NOT EXISTS trip_gear_gear_id_idx ON public.trip_gear(gear_id);

-- ============================================
-- 第三部分：啟用 Row Level Security (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gear ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_gear ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 第四部分：Profiles RLS 政策
-- ============================================

-- 所有人可以讀取公開的 profiles
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles"
ON public.profiles
FOR SELECT
USING (true);

-- 使用者可以更新自己的 profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 使用者可以插入自己的 profile（通常由 trigger 自動處理）
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 第五部分：Trip RLS 政策
-- ============================================

-- 所有人都可以讀取旅程（公開）
DROP POLICY IF EXISTS "Allow public read access to trips" ON public.trip;
CREATE POLICY "Allow public read access to trips"
ON public.trip
FOR SELECT
USING (true);

-- 只有擁有者可以插入自己的旅程
DROP POLICY IF EXISTS "Users can insert their own trips" ON public.trip;
CREATE POLICY "Users can insert their own trips"
ON public.trip
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 只有擁有者可以更新自己的旅程
DROP POLICY IF EXISTS "Users can update their own trips" ON public.trip;
CREATE POLICY "Users can update their own trips"
ON public.trip
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 只有擁有者可以刪除自己的旅程
DROP POLICY IF EXISTS "Users can delete their own trips" ON public.trip;
CREATE POLICY "Users can delete their own trips"
ON public.trip
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 第六部分：Gear RLS 政策
-- ============================================

-- 所有人都可以讀取裝備（公開）
DROP POLICY IF EXISTS "Allow public read access to gear" ON public.gear;
CREATE POLICY "Allow public read access to gear"
ON public.gear
FOR SELECT
USING (true);

-- 只有擁有者可以插入自己的裝備
DROP POLICY IF EXISTS "Users can insert their own gear" ON public.gear;
CREATE POLICY "Users can insert their own gear"
ON public.gear
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 只有擁有者可以更新自己的裝備
DROP POLICY IF EXISTS "Users can update their own gear" ON public.gear;
CREATE POLICY "Users can update their own gear"
ON public.gear
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 只有擁有者可以刪除自己的裝備
DROP POLICY IF EXISTS "Users can delete their own gear" ON public.gear;
CREATE POLICY "Users can delete their own gear"
ON public.gear
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 第七部分：Trip_Gear RLS 政策
-- ============================================

-- 所有人都可以讀取旅程-裝備關聯（公開）
DROP POLICY IF EXISTS "Allow public read access to trip_gear" ON public.trip_gear;
CREATE POLICY "Allow public read access to trip_gear"
ON public.trip_gear
FOR SELECT
USING (true);

-- 只有旅程擁有者可以新增關聯
DROP POLICY IF EXISTS "Trip owners can insert trip_gear relations" ON public.trip_gear;
CREATE POLICY "Trip owners can insert trip_gear relations"
ON public.trip_gear
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trip
    WHERE trip.id = trip_gear.trip_id
    AND trip.user_id = auth.uid()
  )
);

-- 只有旅程擁有者可以刪除關聯
DROP POLICY IF EXISTS "Trip owners can delete trip_gear relations" ON public.trip_gear;
CREATE POLICY "Trip owners can delete trip_gear relations"
ON public.trip_gear
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.trip
    WHERE trip.id = trip_gear.trip_id
    AND trip.user_id = auth.uid()
  )
);

-- ============================================
-- 第八部分：Auto Profile Trigger
-- ============================================

-- 當新使用者註冊時，自動建立 profile
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
    NEW.email,
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 為現有使用者補建 Profile
INSERT INTO public.profiles (user_id, username, display_name, created_at, updated_at)
SELECT 
  id,
  email,
  NULL,
  created_at,
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- 第九部分：測試資料（已註解，避免 FK 錯誤）
-- ============================================
-- 
-- 注意：測試資料需要先在 auth.users 中建立對應的使用者
-- 建議：在應用程式中透過 Google OAuth 登入後，自動建立 profile
-- 
-- 如需啟用測試資料，請先執行：
-- INSERT INTO auth.users (id, email) VALUES 
--   ('00000000-0000-0000-0000-000000000001'::uuid, 'test@example.com');

/*
-- 測試使用者 Profile
INSERT INTO public.profiles (user_id, username, display_name, bio, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'demo_user',
  '示範使用者',
  '戶外探險愛好者',
  now()
)
ON CONFLICT (user_id) DO NOTHING;

-- 測試旅程
INSERT INTO public.trip (id, user_id, slug, title, description, location, images, tags, created_at)
VALUES
  (
    'a1111111-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'kumano-kodo',
    '日本熊野古道 4 天 3 夜',
    '人生第一次去日本，選擇日本朝聖之路「熊野古道中邊路」作為日本旅行的前部曲。',
    '中邊路',
    ARRAY['/trail1.jpg', '/trail2.jpg'],
    ARRAY['#熊野古道', '#朝聖之路', '#輕量化'],
    now()
  ),
  (
    'a2222222-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'jade-mountain',
    '玉山主峰單攻',
    '台灣百岳之首，海拔 3952 公尺。',
    '玉山主峰',
    ARRAY['/mountain1.jpg'],
    ARRAY['#百岳', '#單攻', '#登山'],
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- 測試裝備
INSERT INTO public.gear (id, user_id, name, category, description, image_url, specs, tags, created_at)
VALUES
  (
    'b1111111-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Stellaridge Tent 1',
    '睡眠系統',
    '超輕量單人帳篷',
    '/tent.jpg',
    '{"brand": "mont-bell", "weight_g": 1350, "price_twd": 8000}'::jsonb,
    ARRAY['#單人帳', '#輕量化'],
    now()
  ),
  (
    'b2222222-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Stretch M550 睡袋',
    '睡眠系統',
    '羽絨睡袋，舒適溫度 -5°C',
    '/sleeping-bag.jpg',
    '{"brand": "Chinook", "weight_g": 1000, "fill_power": "750+FP"}'::jsonb,
    ARRAY['#羽絨睡袋'],
    now()
  ),
  (
    'b3333333-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'TUFF 單日健行背包',
    '背負系統',
    '20L 輕量化背包',
    '/backpack.jpg',
    '{"brand": "HANCHOR", "weight_g": 652, "capacity_l": 20}'::jsonb,
    ARRAY['#背包'],
    now()
  ),
  (
    'b4444444-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'HA11 頭燈',
    '電子配備',
    '輕量化頭燈',
    '/headlamp.jpg',
    '{"brand": "NITECORE", "weight_g": 36, "lumens": 1000}'::jsonb,
    ARRAY['#輕量化', '#LED'],
    now()
  ),
  (
    'b5555555-0000-0000-0000-000000000005'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '碳纖維登山杖',
    '其他',
    '可折疊輕量登山杖',
    '/trekking-pole.jpg',
    '{"brand": "Cascade Mountain Tech", "weight_g": 414, "sections": 3}'::jsonb,
    ARRAY['#登山杖'],
    now()
  )
ON CONFLICT (id) DO NOTHING;
*/

-- 注意：以上測試資料都已註解，migration 完成後資料庫為空
-- 請透過應用程式登入後，系統會自動建立 profile
-- 然後您可以在應用程式中建立 trips 和 gear

-- ============================================
-- 第十部分：表格註解
-- ============================================

COMMENT ON TABLE public.profiles IS '使用者個人資料';
COMMENT ON TABLE public.trip IS '戶外旅程記錄';
COMMENT ON TABLE public.gear IS '戶外裝備';
COMMENT ON TABLE public.trip_gear IS '旅程與裝備的多對多關聯表';

COMMENT ON COLUMN public.profiles.user_id IS '關聯到 auth.users 的 ID';
COMMENT ON COLUMN public.profiles.gear_dashboard_title IS '裝備儀表板自訂標題';
COMMENT ON COLUMN public.trip.slug IS 'URL 友善的唯一識別碼';
COMMENT ON COLUMN public.trip.tags IS '旅程標籤（如 #登山 #露營）';
COMMENT ON COLUMN public.gear.specs IS 'JSON 格式的裝備規格';

COMMENT ON FUNCTION public.handle_new_user() IS '當新使用者註冊時，自動在 profiles 表建立對應記錄';

