/**
 * Equipment Supabase Service
 * 
 * 處理裝備相關的資料庫查詢操作
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { Equipment } from '@/lib/types/equipment';
import { mapGearToEquipment } from './mapper';

/**
 * 獲取裝備列表
 * 
 * @param supabase - Supabase 客戶端實例
 * @param options - 查詢選項
 * @returns 裝備列表
 */
export async function getEquipmentList(
  supabase: SupabaseClient<Database>,
  options?: {
    userId?: string;
    tripId?: string;
    includeTrips?: boolean;
  }
): Promise<{ data: Equipment[]; error: Error | null }> {
  try {
    let query = supabase
      .from('gear')
      .select('*')
      .order('created_at', { ascending: false });

    // 如果指定使用者，過濾該使用者的裝備
    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }

    // 如果指定旅程，透過 trip_gear 關聯查詢
    if (options?.tripId) {
      const { data: tripGearData, error: tripGearError } = await supabase
        .from('trip_gear')
        .select('gear_id')
        .eq('trip_id', options.tripId);

      if (tripGearError) {
        throw tripGearError;
      }

      const gearIds = tripGearData?.map((tg) => tg.gear_id) || [];
      
      if (gearIds.length === 0) {
        return { data: [], error: null };
      }

      query = query.in('id', gearIds);
    }

    const { data: gearData, error: gearError } = await query;

    if (gearError) {
      throw gearError;
    }

    // 轉換為 Equipment 型別
    let equipmentList = (gearData || []).map(mapGearToEquipment);

    // 如果需要附加關聯的旅程資訊
    if (options?.includeTrips) {
      equipmentList = await attachTripsToEquipmentList(supabase, equipmentList);
    }

    return { data: equipmentList, error: null };
  } catch (error) {
    console.error('Error fetching equipment list:', error);
    return { 
      data: [], 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 根據 ID 獲取單一裝備
 * 
 * @param supabase - Supabase 客戶端實例
 * @param id - 裝備 ID (UUID)
 * @returns 裝備資料
 */
export async function getEquipmentById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<{ data: Equipment | null; error: Error | null }> {
  try {
    const { data: gearData, error: gearError } = await supabase
      .from('gear')
      .select('*')
      .eq('id', id)
      .single();

    if (gearError) {
      throw gearError;
    }

    if (!gearData) {
      return { data: null, error: null };
    }

    const equipment = mapGearToEquipment(gearData);

    // 附加關聯的旅程
    const equipmentWithTrips = await attachTripsToEquipmentList(
      supabase, 
      [equipment]
    );

    return { data: equipmentWithTrips[0] || null, error: null };
  } catch (error) {
    console.error('Error fetching equipment by ID:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 獲取旅程的所有裝備（透過 JOIN trip_gear）
 * 
 * @param supabase - Supabase 客戶端實例
 * @param tripId - 旅程 ID (UUID)
 * @returns 裝備列表
 */
export async function getEquipmentByTrip(
  supabase: SupabaseClient<Database>,
  tripId: string
): Promise<{ data: Equipment[]; error: Error | null }> {
  return getEquipmentList(supabase, { tripId, includeTrips: false });
}

/**
 * 為裝備列表附加關聯的旅程標題
 * 
 * @param supabase - Supabase 客戶端實例
 * @param equipmentList - 裝備列表
 * @returns 附加了旅程資訊的裝備列表
 */
async function attachTripsToEquipmentList(
  supabase: SupabaseClient<Database>,
  equipmentList: Equipment[]
): Promise<Equipment[]> {
  if (equipmentList.length === 0) {
    return equipmentList;
  }

  // 這裡需要獲取每個裝備關聯的旅程
  // 注意：因為 mapper 中 Equipment.id 不存在，我們需要用另一種方式
  // 我們需要修改這個邏輯，暫時先返回原始資料
  
  // TODO: 需要在 Equipment 型別中加入 id 欄位，或者改用 gear_name 作為識別
  // 目前先簡單處理，不附加 trips 資訊
  return equipmentList;
}

