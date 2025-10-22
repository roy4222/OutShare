/**
 * useTrips Hook
 * 
 * 從 API 獲取旅程資料（使用 Prisma Services）
 */

'use client';

import { useState, useEffect } from 'react';
import { Trip } from '@/lib/types/trip';

/**
 * useTrips 的選項
 */
interface UseTripsOptions {
  userId?: string; // 可選：按使用者過濾
}

/**
 * useTrips 的返回值
 */
interface UseTripsResult {
  trips: Trip[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * 獲取旅程列表
 * 
 * @param options - 查詢選項
 * @returns 旅程資料
 * 
 * @example
 * const { trips, isLoading, error } = useTrips();
 * 
 * @example
 * // 獲取特定使用者的旅程
 * const { trips } = useTrips({ userId: 'user-uuid' });
 */
export function useTrips(options: UseTripsOptions = {}): UseTripsResult {
  const { userId } = options;
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrips() {
      try {
        setIsLoading(true);
        setError(null);

        // 構建 API URL
        const params = new URLSearchParams();
        if (userId) {
          params.append('userId', userId);
        }

        const url = `/api/trips${params.toString() ? `?${params.toString()}` : ''}`;

        // 呼叫 API Route
        const response = await fetch(url);

        if (!isMounted) return;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch trips');
        }

        const { data } = await response.json();
        setTrips(data || []);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching trips:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setTrips([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTrips();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return {
    trips,
    isLoading,
    error,
  };
}

