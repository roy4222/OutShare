/**
 * useEquipment Hook
 *
 * 封裝裝備資料和過濾邏輯（從 API 獲取，使用 Drizzle Services）
 */

'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Equipment, GroupedEquipment } from '@/lib/types/equipment';
import {
  filterEquipmentByTrip,
  groupEquipmentByCategory,
} from '@/lib/services/equipment.service';

/**
 * useEquipment 的選項
 */
interface UseEquipmentOptions {
  tripTitle?: string; // 可選：按旅程過濾（透過 title 匹配）
  tripId?: string; // 可選：按旅程 ID 或 slug 過濾
  groupByCategory?: boolean; // 可選：是否按分類分組
  userId?: string; // 可選：按使用者過濾
}

/**
 * useEquipment 的返回值
 */
interface UseEquipmentResult {
  equipment: Equipment[];
  groupedEquipment: GroupedEquipment | null;
  isEmpty: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 獲取並處理裝備資料（從 Supabase）
 * 
 * @param options - 選項（過濾、分組等）
 * @returns 處理後的裝備資料
 * 
 * @example
 * // 獲取所有裝備並分組
 * const { groupedEquipment, isLoading } = useEquipment({ groupByCategory: true });
 * 
 * @example
 * // 獲取特定旅程的裝備
 * const { equipment } = useEquipment({ tripId: 'Kumano_Kodo' });
 */
export function useEquipment(
  options: UseEquipmentOptions = {}
): UseEquipmentResult {
  const { tripTitle, tripId, groupByCategory = false, userId } = options;

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 從 API 獲取裝備資料（抽取為獨立函數以便重複使用）
  const fetchEquipment = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      // 構建 API URL
      const params = new URLSearchParams();
      if (userId) {
        params.append('userId', userId);
      }
      if (tripId) {
        params.append('tripId', tripId);
      }
      // 修正：當需要 tripTitle 過濾時，自動加上 includeTrips
      if (tripTitle) {
        params.append('includeTrips', 'true');
      }

      const url = `/api/equipment${params.toString() ? `?${params.toString()}` : ''}`;

      // 呼叫 API Route
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch equipment');
      }

      const { data } = await response.json();
      if (!isMountedRef.current) {
        return;
      }

      setEquipment(data || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      if (!isMountedRef.current) {
        return;
      }

      setError(err instanceof Error ? err : new Error('Unknown error'));
      setEquipment([]);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [tripId, userId, tripTitle]);

  useEffect(() => {
    let isMounted = true;

    const loadEquipment = async () => {
      const abortController = new AbortController();

      try {
        if (!isMounted) return;
        setIsLoading(true);
        setError(null);

        // 構建 API URL
        const params = new URLSearchParams();
        if (userId) {
          params.append('userId', userId);
        }
        if (tripId) {
          params.append('tripId', tripId);
        }
        // 修正：當需要 tripTitle 過濾時，自動加上 includeTrips
        if (tripTitle) {
          params.append('includeTrips', 'true');
        }

        const url = `/api/equipment${params.toString() ? `?${params.toString()}` : ''}`;

        // 呼叫 API Route with abort signal
        const response = await fetch(url, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch equipment');
        }

        const { data } = await response.json();

        if (isMounted) {
          setEquipment(data || []);
        }
      } catch (err) {
        // 忽略取消請求的錯誤
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Error fetching equipment:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setEquipment([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEquipment();

    return () => {
      isMounted = false;
    };
  }, [fetchEquipment, userId, tripId, tripTitle]);

  // 如果使用 tripTitle 過濾（向後相容）
  const filteredEquipment = useMemo(() => {
    if (tripTitle) {
      return filterEquipmentByTrip(equipment, tripTitle);
    }
    return equipment;
  }, [equipment, tripTitle]);

  // 分組裝備（如果需要）
  const groupedEquipment = useMemo(() => {
    if (!groupByCategory) {
      return null;
    }
    return groupEquipmentByCategory(filteredEquipment);
  }, [filteredEquipment, groupByCategory]);

  return {
    equipment: filteredEquipment,
    groupedEquipment,
    isEmpty: filteredEquipment.length === 0,
    isLoading,
    error,
    refetch: fetchEquipment,
  };
}
