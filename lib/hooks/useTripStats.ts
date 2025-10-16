/**
 * useTripStats Hook
 * 
 * 封裝旅程統計計算邏輯
 */

import { useMemo } from 'react';
import { TripStats } from '@/lib/types/trip';
import { calculateTripStats } from '@/lib/services/trips.service';
import { equipmentData } from '@/data/equiment';

/**
 * 計算並返回旅程統計資料
 * 
 * @param tripTitle - 旅程標題
 * @returns 旅程統計資料（總重量、總價格、裝備數量）
 * 
 * @example
 * const stats = useTripStats('日本熊野古道 4 天 3 夜');
 * console.log(stats.totalWeight); // 7.5 (公斤)
 */
export function useTripStats(tripTitle: string): TripStats {
  const stats = useMemo(() => {
    return calculateTripStats(tripTitle, equipmentData);
  }, [tripTitle]);

  return stats;
}

