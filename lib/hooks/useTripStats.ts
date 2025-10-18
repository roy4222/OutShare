/**
 * useTripStats Hook
 * 
 * 封裝旅程統計計算邏輯（從 Supabase 獲取裝備後計算）
 */

'use client';

import { useState, useEffect } from 'react';
import { TripStats } from '@/lib/types/trip';
import { supabaseClient } from '@/lib/supabase/client';
import { getTripUuidBySlug, getEquipmentByTrip } from '@/lib/services/supabase';

/**
 * 計算並返回旅程統計資料
 * 
 * @param tripIdOrSlug - 旅程 ID 或 slug
 * @returns 旅程統計資料（總重量、總價格、裝備數量）
 * 
 * @example
 * const { stats, isLoading } = useTripStats('Kumano_Kodo');
 * console.log(stats.totalWeight); // 7.5 (公斤)
 */
export function useTripStats(tripIdOrSlug: string): {
  stats: TripStats;
  isLoading: boolean;
  error: Error | null;
} {
  const [stats, setStats] = useState<TripStats>({
    totalWeight: 0,
    totalPrice: 0,
    equipmentCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAndCalculateStats() {
      try {
        setIsLoading(true);
        setError(null);

        // 先獲取旅程的 UUID（如果傳入的是 slug）
        const { data: uuid } = await getTripUuidBySlug(
          supabaseClient,
          tripIdOrSlug
        );

        const actualTripId = uuid || tripIdOrSlug;

        // 獲取旅程的裝備
        const { data: equipment, error: fetchError } = await getEquipmentByTrip(
          supabaseClient,
          actualTripId
        );

        if (!isMounted) return;

        if (fetchError) {
          throw fetchError;
        }

        // 計算統計資料
        const totalWeight = equipment.reduce(
          (sum, item) => sum + (item.weight || 0),
          0
        );
        const totalPrice = equipment.reduce(
          (sum, item) => sum + (item.price || 0),
          0
        );

        setStats({
          totalWeight: totalWeight / 1000, // 轉換為公斤
          totalPrice,
          equipmentCount: equipment.length,
        });
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setStats({
          totalWeight: 0,
          totalPrice: 0,
          equipmentCount: 0,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAndCalculateStats();

    return () => {
      isMounted = false;
    };
  }, [tripIdOrSlug]);

  return { stats, isLoading, error };
}

