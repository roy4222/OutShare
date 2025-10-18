-- 為 trip 表添加 slug 欄位
-- 用於保留原有的字串 ID（如 "Kumano_Kodo"），方便 URL 使用
ALTER TABLE public.trip 
ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- 添加索引提升查詢效能
CREATE INDEX IF NOT EXISTS trip_slug_idx ON public.trip(slug);

-- 添加註解
COMMENT ON COLUMN public.trip.slug IS '旅程的 URL 友善識別碼（如：Kumano_Kodo）';

