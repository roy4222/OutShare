-- 將 dashboard_title 從 gear 表移到 profiles 表
-- 這樣每個使用者只需要儲存一個標題設定

-- 1. 在 profiles 表新增 dashboard_title 欄位
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dashboard_title VARCHAR(50) NULL;

-- 2. 從 gear 表移除 dashboard_title 欄位
ALTER TABLE public.gear 
DROP COLUMN IF EXISTS dashboard_title;

-- 3. 添加註解
COMMENT ON COLUMN public.profiles.dashboard_title IS '使用者自訂的裝備管理頁面標題（最多 50 字元）';

-- 4. 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS profiles_dashboard_title_idx ON public.profiles(dashboard_title) 
WHERE dashboard_title IS NOT NULL;

