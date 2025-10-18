/**
 * useEquipment Hook
 * 
 * 封裝裝備資料和過濾邏輯（從 Supabase 獲取）
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Equipment, GroupedEquipment } from '@/lib/types/equipment';
import {
  filterEquipmentByTrip,
  groupEquipmentByCategory,
} from '@/lib/services/equipment.service';
import { supabaseClient } from '@/lib/supabase/client';
import { getEquipmentList, getTripUuidBySlug } from '@/lib/services/supabase';

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

  // 從 Supabase 獲取裝備資料
  useEffect(() => {
    let isMounted = true;

    async function fetchEquipment() {
      try {
        setIsLoading(true);
        setError(null);

        // 如果有 tripId，需要先獲取對應的 UUID
        let actualTripId = tripId;
        if (tripId) {
          const { data: uuid } = await getTripUuidBySlug(supabaseClient, tripId);
          if (uuid) {
            actualTripId = uuid;
          }
        }

        // 從 Supabase 獲取裝備
        const { data, error: fetchError } = await getEquipmentList(
          supabaseClient,
          {
            userId,
            tripId: actualTripId,
            includeTrips: false,
          }
        );

        if (!isMounted) return;

        if (fetchError) {
          throw fetchError;
        }

        setEquipment(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching equipment:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setEquipment([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEquipment();

    return () => {
      isMounted = false;
    };
  }, [tripId, userId]);

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
  };
}

