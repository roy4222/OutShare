-- 資料遷移腳本：將靜態資料匯入 Supabase
-- 來源：data/trips.ts 和 data/equiment.ts

-- ============================================
-- 1. 建立測試使用者（如果不存在）
-- ============================================
-- 注意：這裡使用固定的 UUID，實際部署時請替換為真實的使用者 ID
-- 或透過 Supabase Dashboard 手動建立使用者後取得 ID

INSERT INTO public.profiles (id, username, avatar_url, bio, social_links, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'demo_user',
  NULL,
  '戶外探險愛好者',
  '{}'::jsonb,
  now()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. 插入旅程資料（4 個旅程）
-- ============================================

INSERT INTO public.trip (id, slug, title, images, location, duration, tags, description, user_id, created_at)
VALUES
  (
    'a1111111-0000-0000-0000-000000000001'::uuid,
    'Kumano_Kodo',
    '日本熊野古道 4 天 3 夜',
    ARRAY['/_R812133.webp','/_R812134.JPG.webp','/_R812136.JPG.webp','/_R812137.JPG.webp','/_R812139.JPG.webp'],
    '中邊路',
    '4 天',
    ARRAY['#熊野古道', '#朝聖之路', '#鄉間', '#輕量化', '#單人旅程'],
    '人生第一次去日本，選擇日本朝聖之路「熊野古道中邊路 (Kumano Kodo)」 作為日本旅行的前部曲。

出發前還擔心會不會下雨，幸運的是，在中邊路的 4 天都沒遇到雨天，防雨裝備都沒用到。
日本獨旅 12 天，熊野古道結束後便去附近沿海小城鎮，後來還去東京、箱根，我還是最喜歡熊野古道，喜歡沈浸在山林與光陰的沐浴下，喜歡結束 1 天的健行後，在民宿的溫泉放鬆、享受山中小鎮平靜與平凡。

中邊路這路線位於山區，可依自身體能和時間去規劃適合自己的踏破方法，中間遇到不同國家的健行者，有些人是輕裝、有些則是重裝（說要去民宿野營，我覺得很酷），大家的規劃都不同。

▋ 有人是走完全踏破，並將手冊蓋滿印章。
▋ 有人則是徒步搭配巴士。
▋ 有人則是全程包車，然後只走一點點😆。

不得不說，這路線維護得超好，中途標誌十分清楚，基本上不會迷路，但還是得具備一定的體能與腳力。
第一天我走了 14 公里左右，大概 6 小時左右時間，而且前半段是陡上，身上背 7 公斤多的包包還是會覺得累跟喘，但沿途的風景，讓我覺得一切都是值得的。

補充：熊野古道擁有 1,000 多年歷史，是過去苦行僧、皇族、貴族等參拜者走過的道路，受到了神道和佛教融合的影響，過去為信仰和修行的場所',
    '00000000-0000-0000-0000-000000000001'::uuid,
    now()
  ),
  (
    'a2222222-0000-0000-0000-000000000002'::uuid,
    'Jiali_Mountain_Fengmei_Stream',
    '加里山風美溪 3 天 2 夜',
    ARRAY['/_R812550.JPG.webp','/_R812560.JPG 的副本.webp','/_R812576.JPG 的副本.webp','/_R812587.JPG 的副本.webp'],
    '加里山風美溪',
    '3 天',
    ARRAY['#野營', '#山林探險 ', '#風美溪'],
    NULL,
    '00000000-0000-0000-0000-000000000001'::uuid,
    now()
  ),
  (
    'a3333333-0000-0000-0000-000000000003'::uuid,
    'Bikepacking_Tonghou_Forest_Road',
    'Bikpacking - 桶后林道 2 天 1 夜',
    ARRAY['/_R812632.JPG 的副本.webp','/_R812646.JPG 的副本.webp','/_R812650.JPG 的副本.webp','/_R812677.JPG 的副本.webp','/_R812678.JPG 的副本.webp'],
    '桶后林道',
    '2 天',
    ARRAY['#Bikepacking', '#林道', '#輕量化', '#單人旅程'],
    NULL,
    '00000000-0000-0000-0000-000000000001'::uuid,
    now()
  ),
  (
    'a4444444-0000-0000-0000-000000000004'::uuid,
    'Bikepacking_Huayan_Mountain_Foot',
    'Bikpacking - 火炎山山腳 2 天 1 夜',
    ARRAY['/S__40583178_0.webp','/S__40583180_0.webp','/S__40583181_0.webp'],
    '火炎山山腳',
    '2 天',
    ARRAY['#Bikepacking', '#輕量化'],
    NULL,
    '00000000-0000-0000-0000-000000000001'::uuid,
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. 插入裝備資料（12 個裝備）
-- ============================================

INSERT INTO public.gear (id, user_id, gear_name, brand, weight_g, price_twd, tags, image_url, category, buy_link, created_at)
VALUES
  (
    'b1111111-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Stellaridge Tent 1 Rain Fly',
    'mont-bell',
    1350,
    8000,
    ARRAY['#單人帳'],
    '/1122653_pe.webp',
    '睡眠系統',
    NULL,
    now()
  ),
  (
    'b2222222-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Stratosphere 5.5',
    'Rab',
    785,
    2800,
    ARRAY['#充氣睡墊'],
    '/tw-11134207-7rasg-m0okdvy0xryr80resize_w450_nl.webp',
    '睡眠系統',
    NULL,
    now()
  ),
  (
    'b3333333-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Strech M550',
    'Chinook',
    1000,
    6300,
    ARRAY['#蓬鬆度 750+FP', '#填充量 550 克', '#極限 -15°C', '#舒適 -5°C'],
    '/800_e0f4dceab9972080eb50ed13797739b3.jpg',
    '睡眠系統',
    NULL,
    now()
  ),
  (
    'b4444444-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'TUFF 單日健行背包',
    'HANCHOR',
    652,
    4990,
    ARRAY[]::text[],
    '/hanchor_tuff.webp',
    '背負系統',
    NULL,
    now()
  ),
  (
    'b5555555-0000-0000-0000-000000000005'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'SURFACE MINI 輕量化小包',
    'HANCHOR',
    50,
    880,
    ARRAY['#相機包'],
    '/hanchor_surface mini.webp',
    '背負系統',
    'https://www.hanchor.com/products/Surface%20Series/Surface_Mini?locale=zh-TW',
    now()
  ),
  (
    'b6666666-0000-0000-0000-000000000006'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '行動電源',
    'AUKEY',
    181,
    640,
    ARRAY['#10000mAh'],
    '/aukey-sprint-go-mini-pb-y37_01_o1000x1000.webp',
    '電子配備',
    NULL,
    now()
  ),
  (
    'b7777777-0000-0000-0000-000000000007'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'HA11 頭燈',
    'NITECORE',
    36,
    600,
    ARRAY['#輕量化'],
    '/57396109.webp',
    '電子配備',
    NULL,
    now()
  ),
  (
    'b8888888-0000-0000-0000-000000000008'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'GR',
    'Ricoh',
    257,
    15000,
    ARRAY['#快拍神機'],
    '/000001_1713933049.webp',
    '電子配備',
    NULL,
    now()
  ),
  (
    'b9999999-0000-0000-0000-000000000009'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '充電線',
    'Zmi',
    50,
    550,
    ARRAY[]::text[],
    '/TP00042650000001_O.webp',
    '電子配備',
    NULL,
    now()
  ),
  (
    'baaaaaaa-0000-0000-0000-00000000000a'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Conveyor Tee',
    'Marmot',
    160,
    800,
    ARRAY[]::text[],
    '/1732758824_376897082bb32b9aea70.webp',
    '衣物',
    NULL,
    now()
  ),
  (
    'bbbbbbb0-0000-0000-0000-00000000000b'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '碳纖維登山杖',
    'Cascade Mountain Tech',
    414,
    1000,
    ARRAY[]::text[],
    '/Cascade Mountain Tech.webp',
    '其他',
    NULL,
    now()
  ),
  (
    'bcccccc0-0000-0000-0000-00000000000c'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '20 - 40 L 登山健行背包防水套',
    'QUECHUA',
    128,
    199,
    ARRAY[]::text[],
    'https://contents.mediadecathlon.com/p2226984/k$4253db865c160ba13e27720aeb3a7b46/20-40-l-%E7%99%BB%E5%B1%B1%E5%81%A5%E8%A1%8C%E8%83%8C%E5%8C%85%E9%98%B2%E6%B0%B4%E5%A5%97-quechua-8734213.jpg?f=1920x0&format=auto',
    '其他',
    'https://www.decathlon.tw/p/20-40-l-%E7%99%BB%E5%B1%B1%E5%81%A5%E8%A1%8C%E8%83%8C%E5%8C%85%E9%98%B2%E6%B0%B4%E5%A5%97-quechua-8734213.html?indexName=prod_pim_v1_index&queryID=7e3c27d97773910b52597cfb7acc1d7a',
    now()
  ),
  (
    'bdddddd0-0000-0000-0000-00000000000d'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '拖鞋 Mush II',
    'Teva',
    92,
    900,
    ARRAY[]::text[],
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuAl3__VsJL85W-ztI3B918qw2DVBDZDuSCw&s',
    '其他',
    NULL,
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. 建立 trip_gear 關聯（多對多關聯）
-- ============================================
-- 根據原本 equipmentData 中的 trips 欄位建立關聯

-- Stellaridge Tent 1 Rain Fly: 3 個旅程
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b1111111-0000-0000-0000-000000000001'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- Stratosphere 5.5: 3 個旅程
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b2222222-0000-0000-0000-000000000002'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- Strech M550: 3 個旅程
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b3333333-0000-0000-0000-000000000003'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- TUFF 單日健行背包: 1 個旅程
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b4444444-0000-0000-0000-000000000004'::uuid
FROM public.trip t
WHERE t.title = '日本熊野古道 4 天 3 夜'
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- SURFACE MINI 輕量化小包: 4 個旅程（全部）
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b5555555-0000-0000-0000-000000000005'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜', '日本熊野古道 4 天 3 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- 行動電源: 4 個旅程（全部）
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b6666666-0000-0000-0000-000000000006'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜', '日本熊野古道 4 天 3 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- HA11 頭燈: 4 個旅程（全部）
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b7777777-0000-0000-0000-000000000007'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜', '日本熊野古道 4 天 3 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- GR 相機: 4 個旅程（全部）
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b8888888-0000-0000-0000-000000000008'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜', '日本熊野古道 4 天 3 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- 充電線: 4 個旅程（全部）
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'b9999999-0000-0000-0000-000000000009'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜', '日本熊野古道 4 天 3 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- Conveyor Tee: 4 個旅程（全部）
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'baaaaaaa-0000-0000-0000-00000000000a'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜', '日本熊野古道 4 天 3 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- 碳纖維登山杖: 2 個旅程
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'bbbbbbb0-0000-0000-0000-00000000000b'::uuid
FROM public.trip t
WHERE t.title IN ('日本熊野古道 4 天 3 夜', '加里山風美溪 3 天 2 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- 20 - 40 L 登山健行背包防水套: 1 個旅程
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'bcccccc0-0000-0000-0000-00000000000c'::uuid
FROM public.trip t
WHERE t.title = '日本熊野古道 4 天 3 夜'
ON CONFLICT (trip_id, gear_id) DO NOTHING;

-- 拖鞋 Mush II: 4 個旅程（全部）
INSERT INTO public.trip_gear (trip_id, gear_id)
SELECT t.id, 'bdddddd0-0000-0000-0000-00000000000d'::uuid
FROM public.trip t
WHERE t.title IN ('加里山風美溪 3 天 2 夜', 'Bikpacking - 桶后林道 2 天 1 夜', 'Bikpacking - 火炎山山腳 2 天 1 夜', '日本熊野古道 4 天 3 夜')
ON CONFLICT (trip_id, gear_id) DO NOTHING;

