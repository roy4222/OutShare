/**
 * Gear Dashboard Service
 * 
 * 處理裝備儀表板相關的資料庫操作
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

/**
 * 獲取使用者的裝備儀表板標題
 * 
 * @param supabase - Supabase 客戶端實例
 * @param userId - 使用者 ID
 * @returns 自訂標題（若無則返回 null）
 */
export async function getDashboardTitle(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<{ data: string | null; error: Error | null }> {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('dashboard_title')
      .eq('id', userId)
      .single();

    if (profileError) {
      // 如果找不到 profile，返回 null（不是錯誤）
      if (profileError.code === 'PGRST116') {
        return { data: null, error: null };
      }
      console.error('Error fetching dashboard title:', profileError);
      throw new Error(`無法讀取標題: ${profileError.message}`);
    }

    return { data: profileData?.dashboard_title || null, error: null };
  } catch (error) {
    console.error('Error in getDashboardTitle:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('讀取標題失敗') 
    };
  }
}

/**
 * 更新使用者的裝備儀表板標題
 * 
 * @param supabase - Supabase 客戶端實例
 * @param userId - 使用者 ID
 * @param newTitle - 新標題（1-50 字元）
 * @returns 更新結果
 */
export async function updateDashboardTitle(
  supabase: SupabaseClient<Database>,
  userId: string,
  newTitle: string
): Promise<{ data: boolean; error: Error | null }> {
  try {
    // 驗證標題長度
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error('標題不可為空');
    }

    if (newTitle.length > 50) {
      throw new Error('標題長度不可超過 50 字元');
    }

    // 直接更新 profiles 表中的 dashboard_title
    // 使用 upsert 確保即使 profile 不存在也能建立
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(
        { 
          id: userId,
          dashboard_title: newTitle.trim(),
          social_links: {},
          updated_at: new Date().toISOString()
        },
        { 
          onConflict: 'id',
          ignoreDuplicates: false 
        }
      );

    if (updateError) {
      console.error('Error updating dashboard title:', updateError);
      throw new Error(`更新失敗: ${updateError.message}`);
    }

    return { data: true, error: null };
  } catch (error) {
    console.error('Error in updateDashboardTitle:', error);
    return { 
      data: false, 
      error: error instanceof Error ? error : new Error('儲存失敗，請稍後再試') 
    };
  }
}

