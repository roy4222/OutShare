/**
 * 資料轉換層 (Mapper)
 * 
 * 將 Supabase 資料庫的 Row 格式轉換為前端使用的 Domain Model
 */

import { Tables } from '@/lib/database.types';
import { Equipment } from '@/lib/types/equipment';
import { Trip } from '@/lib/types/trip';

/**
 * 將 Supabase gear 表的資料轉換為 Equipment 型別
 * 
 * @param gear - Supabase gear 表的 Row
 * @returns Equipment - 前端使用的裝備型別
 */
export function mapGearToEquipment(gear: Tables<'gear'>): Equipment {
  return {
    name: gear.gear_name || '',
    brand: gear.brand || '',
    weight: gear.weight_g || 0,
    price: gear.price_twd || 0,
    tags: gear.tags || [],
    buy_link: gear.buy_link || undefined,
    image: gear.image_url || undefined,
    category: gear.category,
    // 注意：trips 欄位會在需要時透過 JOIN 查詢 trip_gear 表來填充
    trips: [],
  };
}

/**
 * 將 Supabase trip 表的資料轉換為 Trip 型別
 * 
 * @param trip - Supabase trip 表的 Row
 * @returns Trip - 前端使用的旅程型別
 */
export function mapTripToTrip(trip: Tables<'trip'>): Trip {
  return {
    id: trip.slug || trip.id, // 優先使用 slug，否則使用 UUID
    title: trip.title || '',
    image: trip.images || [],
    alt: trip.title || '', // 使用 title 作為 alt
    location: trip.location || '',
    duration: trip.duration || '',
    tags: trip.tags || [],
    description: trip.description || undefined,
    // 注意：equipment 欄位會在需要時透過 JOIN 查詢 trip_gear 表來填充
    equipment: [],
  };
}

/**
 * 將 gear 資料附加關聯的 trip titles
 * 
 * 公共 API - 供外部使用
 * 
 * @param gear - Equipment 資料
 * @param tripTitles - 關聯的旅程標題陣列
 * @returns Equipment - 附加了 trips 欄位的裝備資料
 */
export function attachTripsToEquipment(
  gear: Equipment,
  tripTitles: string[]
): Equipment {
  return {
    ...gear,
    trips: tripTitles,
  };
}

/**
 * 將 trip 資料附加關聯的 equipment IDs
 * 
 * 公共 API - 供外部使用
 * 
 * @param trip - Trip 資料
 * @param equipmentIds - 關聯的裝備 ID 陣列
 * @returns Trip - 附加了 equipment 欄位的旅程資料
 */
export function attachEquipmentToTrip(
  trip: Trip,
  equipmentIds: string[]
): Trip {
  return {
    ...trip,
    equipment: equipmentIds,
  };
}

