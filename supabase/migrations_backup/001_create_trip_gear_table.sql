-- 建立 trip_gear 關聯表（多對多關聯）
-- 用於連接 trip 和 gear 表
CREATE TABLE IF NOT EXISTS public.trip_gear (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  gear_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT trip_gear_pkey PRIMARY KEY (id),
  CONSTRAINT trip_gear_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trip(id) ON DELETE CASCADE,
  CONSTRAINT trip_gear_gear_id_fkey FOREIGN KEY (gear_id) REFERENCES public.gear(id) ON DELETE CASCADE,
  CONSTRAINT trip_gear_unique UNIQUE (trip_id, gear_id)
);

-- 建立索引提升查詢效能
CREATE INDEX IF NOT EXISTS trip_gear_trip_id_idx ON public.trip_gear(trip_id);
CREATE INDEX IF NOT EXISTS trip_gear_gear_id_idx ON public.trip_gear(gear_id);

-- 添加註解說明
COMMENT ON TABLE public.trip_gear IS '旅程與裝備的多對多關聯表';
COMMENT ON COLUMN public.trip_gear.trip_id IS '旅程 ID（外鍵參照 trip 表）';
COMMENT ON COLUMN public.trip_gear.gear_id IS '裝備 ID（外鍵參照 gear 表）';

