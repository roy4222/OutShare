/**
 * 旅程業務邏輯層
 * 
 * 負責處理旅程相關的業務邏輯，包括：
 * - 旅程資料獲取
 * - 旅程統計計算
 * - 旅程過濾
 */

import { Trip, TripStats } from '@/lib/types/trip';
import { Equipment } from '@/lib/types/equipment';
import { filterEquipmentByTrip, calculateEquipmentStats } from './equipment.service';

/**
 * 計算旅程統計資料
 * 
 * 根據旅程標題，查找所有相關的裝備，並計算總重量和總價格
 * 
 * @param tripTitle - 旅程標題
 * @param allEquipment - 所有裝備資料
 * @returns 旅程統計資料
 */
export function calculateTripStats(
  tripTitle: string,
  allEquipment: Equipment[]
): TripStats {
  // 篩選出與該旅程相關的裝備
  const relatedEquipment = filterEquipmentByTrip(allEquipment, tripTitle);
  
  // 計算裝備統計
  const equipmentStats = calculateEquipmentStats(relatedEquipment);

  return {
    totalWeight: equipmentStats.totalWeight / 1000, // 轉換為公斤
    totalPrice: equipmentStats.totalPrice,
    equipmentCount: equipmentStats.count,
  };
}

/**
 * 按標籤過濾旅程
 * 
 * @param trips - 所有旅程資料
 * @param tags - 要過濾的標籤陣列
 * @returns 包含任一標籤的旅程列表
 */
export function filterTripsByTags(
  trips: Trip[],
  tags: string[]
): Trip[] {
  if (!tags || tags.length === 0) {
    return trips;
  }

  return trips.filter(trip =>
    trip.tags.some(tag => tags.includes(tag))
  );
}

/**
 * 按使用者獲取旅程（預留介面，未來整合資料庫時使用）
 * 
 * @param _userId - 使用者 ID（目前未使用）
 * @returns 該使用者的旅程列表
 */
export function getTripsByUser(_userId: string): Trip[] {
  // TODO: 未來從資料庫獲取
  // 目前返回空陣列作為預留介面
  return [];
}

/**
 * 按 ID 獲取單一旅程
 * 
 * @param trips - 所有旅程資料
 * @param tripId - 旅程 ID
 * @returns 找到的旅程或 undefined
 */
export function getTripById(
  trips: Trip[],
  tripId: string
): Trip | undefined {
  return trips.find(trip => trip.id === tripId);
}

/**
 * 搜尋旅程（按標題、地點、描述）
 * 
 * @param trips - 所有旅程資料
 * @param searchTerm - 搜尋關鍵字
 * @returns 符合搜尋條件的旅程列表
 */
export function searchTrips(
  trips: Trip[],
  searchTerm: string
): Trip[] {
  if (!searchTerm) {
    return trips;
  }

  const term = searchTerm.toLowerCase();
  
  return trips.filter(trip =>
    trip.title.toLowerCase().includes(term) ||
    trip.location.toLowerCase().includes(term) ||
    trip.description?.toLowerCase().includes(term)
  );
}

