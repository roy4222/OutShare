-- 為 gear 表新增 dashboard_title 欄位
-- 用於儲存使用者自訂的裝備管理頁面標題
ALTER TABLE public.gear 
ADD COLUMN IF NOT EXISTS dashboard_title VARCHAR(50) NULL;

-- 添加註解說明
COMMENT ON COLUMN public.gear.dashboard_title IS '使用者自訂的裝備管理頁面標題（最多 50 字元）';

-- 建立索引以提升查詢效能（按 user_id 查詢標題）
CREATE INDEX IF NOT EXISTS gear_user_id_dashboard_title_idx ON public.gear(user_id, dashboard_title);

