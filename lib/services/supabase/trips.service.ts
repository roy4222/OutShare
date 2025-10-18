/**
 * Trips Supabase Service
 * 
 * 處理旅程相關的資料庫查詢操作
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { Trip } from '@/lib/types/trip';
import { Equipment } from '@/lib/types/equipment';
import { mapTripToTrip, attachEquipmentToTrip } from './mapper';
import { getEquipmentByTrip } from './equipment.service';

/**
 * 獲取旅程列表
 * 
 * @param supabase - Supabase 客戶端實例
 * @param options - 查詢選項
 * @returns 旅程列表
 */
export async function getTripList(
  supabase: SupabaseClient<Database>,
  options?: {
    userId?: string;
  }
): Promise<{ data: Trip[]; error: Error | null }> {
  try {
    let query = supabase
      .from('trip')
      .select('*')
      .order('created_at', { ascending: false });

    // 如果指定使用者，過濾該使用者的旅程
    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }

    const { data: tripData, error: tripError } = await query;

    if (tripError) {
      throw tripError;
    }

    // 轉換為 Trip 型別
    const tripList = (tripData || []).map(mapTripToTrip);

    return { data: tripList, error: null };
  } catch (error) {
    console.error('Error fetching trip list:', error);
    return { 
      data: [], 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 根據 ID 獲取單一旅程
 * 
 * @param supabase - Supabase 客戶端實例
 * @param id - 旅程 ID (可以是 UUID 或 slug)
 * @returns 旅程資料
 */
export async function getTripById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<{ data: Trip | null; error: Error | null }> {
  try {
    // 先嘗試用 slug 查詢
    let { data: tripData, error: tripError } = await supabase
      .from('trip')
      .select('*')
      .eq('slug', id)
      .maybeSingle();

    // 如果沒找到，再用 id 查詢
    if (!tripData && !tripError) {
      const result = await supabase
        .from('trip')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      tripData = result.data;
      tripError = result.error;
    }

    if (tripError) {
      throw tripError;
    }

    if (!tripData) {
      return { data: null, error: null };
    }

    const trip = mapTripToTrip(tripData);

    return { data: trip, error: null };
  } catch (error) {
    console.error('Error fetching trip by ID:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 獲取旅程及其關聯的裝備
 * 
 * @param supabase - Supabase 客戶端實例
 * @param id - 旅程 ID (可以是 UUID 或 slug)
 * @returns 旅程資料和裝備列表
 */
export async function getTripWithEquipment(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<{ 
  data: { trip: Trip; equipment: Equipment[] } | null; 
  error: Error | null 
}> {
  try {
    // 先獲取旅程資料
    const { data: trip, error: tripError } = await getTripById(supabase, id);

    if (tripError || !trip) {
      return { 
        data: null, 
        error: tripError || new Error('Trip not found') 
      };
    }

    // 需要用實際的 UUID 來查詢裝備
    // 再次查詢以獲取 UUID
    const { data: tripData } = await supabase
      .from('trip')
      .select('id')
      .or(`slug.eq.${id},id.eq.${id}`)
      .single();

    if (!tripData) {
      return { data: null, error: new Error('Trip not found') };
    }

    // 獲取關聯的裝備
    const { data: equipment, error: equipmentError } = await getEquipmentByTrip(
      supabase,
      tripData.id
    );

    if (equipmentError) {
      return { data: null, error: equipmentError };
    }

    return { 
      data: { trip, equipment }, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching trip with equipment:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 根據 slug 獲取旅程的 UUID
 * 
 * @param supabase - Supabase 客戶端實例
 * @param slug - 旅程的 slug
 * @returns UUID
 */
export async function getTripUuidBySlug(
  supabase: SupabaseClient<Database>,
  slug: string
): Promise<{ data: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('trip')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return { data: data?.id || null, error: null };
  } catch (error) {
    console.error('Error fetching trip UUID by slug:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

