-- 設定 Row Level Security (RLS) 政策
-- 確保公開資料可以被讀取，但只有擁有者可以修改

-- ============================================
-- 1. 啟用 RLS
-- ============================================

ALTER TABLE public.trip ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gear ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_gear ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. Trip 表的 RLS 政策
-- ============================================

-- 所有人都可以讀取旅程資料（公開）
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
-- 3. Gear 表的 RLS 政策
-- ============================================

-- 所有人都可以讀取裝備資料（公開）
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
-- 4. Trip_Gear 關聯表的 RLS 政策
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

