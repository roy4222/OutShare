/**
 * useEquipment Hook
 * 
 * 封裝裝備資料和過濾邏輯
 */

import { useMemo } from 'react';
import { Equipment, GroupedEquipment } from '@/lib/types/equipment';
import {
  filterEquipmentByTrip,
  groupEquipmentByCategory,
} from '@/lib/services/equipment.service';
import { equipmentData } from '@/data/equiment';

/**
 * useEquipment 的選項
 */
interface UseEquipmentOptions {
  tripTitle?: string; // 可選：按旅程過濾
  groupByCategory?: boolean; // 可選：是否按分類分組
}

/**
 * useEquipment 的返回值
 */
interface UseEquipmentResult {
  equipment: Equipment[];
  groupedEquipment: GroupedEquipment | null;
  isEmpty: boolean;
}

/**
 * 獲取並處理裝備資料
 * 
 * @param options - 選項（過濾、分組等）
 * @returns 處理後的裝備資料
 * 
 * @example
 * // 獲取所有裝備並分組
 * const { groupedEquipment } = useEquipment({ groupByCategory: true });
 * 
 * @example
 * // 獲取特定旅程的裝備
 * const { equipment } = useEquipment({ tripTitle: '日本熊野古道 4 天 3 夜' });
 */
export function useEquipment(
  options: UseEquipmentOptions = {}
): UseEquipmentResult {
  const { tripTitle, groupByCategory = false } = options;

  // 過濾裝備
  const filteredEquipment = useMemo(() => {
    return filterEquipmentByTrip(equipmentData, tripTitle);
  }, [tripTitle]);

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
  };
}

