/**
 * 裝備業務邏輯層
 * 
 * 負責處理裝備相關的業務邏輯，包括：
 * - 資料過濾
 * - 分組處理
 * - 統計計算
 */

import { Equipment, EquipmentStats, GroupedEquipment } from '@/lib/types/equipment';

/**
 * 按旅程標題過濾裝備
 * 
 * @param equipment - 所有裝備資料
 * @param tripTitle - 旅程標題
 * @returns 過濾後的裝備列表
 */
export function filterEquipmentByTrip(
  equipment: Equipment[],
  tripTitle?: string
): Equipment[] {
  if (!tripTitle) {
    return equipment;
  }

  return equipment.filter(item =>
    item.trips && item.trips.includes(tripTitle)
  );
}

/**
 * 按分類分組裝備
 * 
 * @param equipment - 裝備列表
 * @returns 按分類分組的裝備物件
 */
export function groupEquipmentByCategory(
  equipment: Equipment[]
): GroupedEquipment {
  return equipment.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as GroupedEquipment);
}

/**
 * 計算裝備統計資料
 * 
 * @param equipment - 裝備列表
 * @returns 統計資料（總重量、總價格、數量）
 */
export function calculateEquipmentStats(
  equipment: Equipment[]
): EquipmentStats {
  const totalWeight = equipment.reduce((total, item) => {
    return total + (item.weight || 0);
  }, 0);

  const totalPrice = equipment.reduce((total, item) => {
    return total + (item.price || 0);
  }, 0);

  return {
    totalWeight, // 公克
    totalPrice, // 台幣
    count: equipment.length,
  };
}

/**
 * 取得特定分類的裝備
 * 
 * @param equipment - 所有裝備資料
 * @param category - 分類名稱
 * @returns 該分類的裝備列表
 */
export function getEquipmentByCategory(
  equipment: Equipment[],
  category: string
): Equipment[] {
  return equipment.filter(item => item.category === category);
}

/**
 * 取得所有裝備分類
 * 
 * @param equipment - 所有裝備資料
 * @returns 不重複的分類名稱陣列
 */
export function getEquipmentCategories(
  equipment: Equipment[]
): string[] {
  const categories = equipment.map(item => item.category);
  return Array.from(new Set(categories));
}

