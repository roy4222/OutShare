import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { equipmentData } from "@/data/equiment"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 計算特定旅程的裝備總重量和總價格
 * 
 * 根據旅程標題，查找所有相關的裝備，並計算：
 * - 總重量（公克）
 * - 總價格（台幣）
 * 
 * @param tripTitle - 旅程標題，用於篩選相關裝備
 * @returns 包含總重量和總價格的物件
 */
export function calculateTripEquipmentTotals(tripTitle: string) {
  // 篩選出與該旅程相關的裝備
  const relatedEquipment = equipmentData.filter(equipment => 
    equipment.trips && equipment.trips.includes(tripTitle)
  );

  // 計算總重量（公克）
  const totalWeight = relatedEquipment.reduce((total, equipment) => {
    return total + (equipment.weight || 0);
  }, 0);

  // 計算總價格（台幣）
  const totalPrice = relatedEquipment.reduce((total, equipment) => {
    return total + (equipment.price || 0);
  }, 0);

  return {
    totalWeight: totalWeight / 1000, // 轉換為公斤
    totalPrice
  };
}
