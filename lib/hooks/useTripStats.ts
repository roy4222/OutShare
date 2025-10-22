/**
 * useTripStats Hook
 * 
 * 封裝旅程統計計算邏輯（從 API 獲取裝備後計算，使用 Prisma Services）
 */

'use client';

import { useState, useEffect } from 'react';
import { TripStats } from '@/lib/types/trip';

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

        // 直接用 tripIdOrSlug 查詢裝備（API 會處理 UUID/slug 轉換）
        const url = `/api/equipment?tripId=${encodeURIComponent(tripIdOrSlug)}`;

        const response = await fetch(url);

        if (!isMounted) return;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch equipment');
        }

        const { data: equipment } = await response.json();

        // 計算統計資料
        const totalWeight = (equipment || []).reduce(
          (sum: number, item: { weight?: number }) => sum + (item.weight || 0),
          0
        );
        const totalPrice = (equipment || []).reduce(
          (sum: number, item: { price?: number }) => sum + (item.price || 0),
          0
        );

        setStats({
          totalWeight: totalWeight / 1000, // 轉換為公斤
          totalPrice,
          equipmentCount: (equipment || []).length,
        });
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching trip stats:', err);
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

