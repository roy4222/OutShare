/**
 * ⚠️ 已廢棄：此檔案已遷移至 Supabase
 * 
 * 此檔案保留作為資料備份和參考
 * 實際資料現在從 Supabase 資料庫讀取
 * 
 * 遷移日期：2025-10-18
 * 對應 Migration: supabase/migrations/003_seed_initial_data.sql
 */

import { Trip } from "@/lib/types/trip";

export const tripsData: Trip[] = [
  {
    id: "Kumano_Kodo",
    title: "日本熊野古道 4 天 3 夜",
    image: [],
    alt: "日本熊野古道 4 天 3 夜",
    location: "中邊路",
    duration: "4 天",
    tags: ["#熊野古道", "#朝聖之路", "#鄉間", "#輕量化", "#單人旅程"],
    description: `人生第一次去日本，選擇日本朝聖之路「熊野古道中邊路 (Kumano Kodo)」 作為日本旅行的前部曲。

出發前還擔心會不會下雨，幸運的是，在中邊路的 4 天都沒遇到雨天，防雨裝備都沒用到。
日本獨旅 12 天，熊野古道結束後便去附近沿海小城鎮，後來還去東京、箱根，我還是最喜歡熊野古道，喜歡沈浸在山林與光陰的沐浴下，喜歡結束 1 天的健行後，在民宿的溫泉放鬆、享受山中小鎮平靜與平凡。

中邊路這路線位於山區，可依自身體能和時間去規劃適合自己的踏破方法，中間遇到不同國家的健行者，有些人是輕裝、有些則是重裝（說要去民宿野營，我覺得很酷），大家的規劃都不同。

▋ 有人是走完全踏破，並將手冊蓋滿印章。
▋ 有人則是徒步搭配巴士。
▋ 有人則是全程包車，然後只走一點點😆。

不得不說，這路線維護得超好，中途標誌十分清楚，基本上不會迷路，但還是得具備一定的體能與腳力。
第一天我走了 14 公里左右，大概 6 小時左右時間，而且前半段是陡上，身上背 7 公斤多的包包還是會覺得累跟喘，但沿途的風景，讓我覺得一切都是值得的。

補充：熊野古道擁有 1,000 多年歷史，是過去苦行僧、皇族、貴族等參拜者走過的道路，受到了神道和佛教融合的影響，過去為信仰和修行的場所`,
  },
  {
    id: "Jiali_Mountain_Fengmei_Stream",
    title: "加里山風美溪 3 天 2 夜",
    image: [],
    alt: "加里山風美溪 3 天 2 夜",
    location: "加里山風美溪",
    duration: "3 天",
    tags: ["#野營", "#山林探險 ", "#風美溪"],
  },
  {
    id: "Bikepacking_Tonghou_Forest_Road",
    title: "Bikpacking - 桶后林道 2 天 1 夜",
    image: [],
    alt: "Bikpacking - 桶后林道 2 天 1 夜",
    location: "桶后林道",
    duration: "2 天",
    tags: ["#Bikepacking", "#林道", "#輕量化", "#單人旅程"],
  },
  {
    id: "Bikepacking_Huayan_Mountain_Foot",
    title: "Bikpacking - 火炎山山腳 2 天 1 夜",
    image: [],
    alt: "Bikpacking - 火炎山山腳 2 天 1 夜",
    location: "火炎山山腳",
    duration: "2 天",
    tags: ["#Bikepacking", "#輕量化"],
  },
];
