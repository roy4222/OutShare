/**
 * 裝備相關型別定義
 */

/**
 * 裝備資料模型（Domain Model）
 */
export interface Equipment {
  id: string; // 裝備唯一識別碼（UUID from database）
  name: string;
  brand: string;
  weight: number; // 單位：公克
  price: number; // 單位：台幣
  tags?: string[];
  buy_link?: string;
  link_name?: string; // 連結顯示名稱
  image?: string;
  category: string; // 裝備分類
  trips?: string[]; // 關聯的旅程標題
}

/**
 * 裝備統計資料
 */
export interface EquipmentStats {
  totalWeight: number; // 單位：公克
  totalPrice: number; // 單位：台幣
  count: number; // 裝備數量
}

/**
 * 分組後的裝備資料
 */
export interface GroupedEquipment {
  [category: string]: Equipment[];
}

/**
 * 裝備卡片組件 Props
 */
export interface EquipmentCardProps {
  equipment: Equipment;
  className?: string;
}

/**
 * 裝備列表組件 Props
 */
export interface EquipmentListProps {
  userId?: string; // 可選的使用者 ID，用於過濾特定使用者的裝備（公開 profile 頁面使用）
  tripTitle?: string; // 可選的旅程標題，用於過濾裝備（向後相容，建議使用 tripId）
  tripId?: string; // 可選的旅程 ID 或 slug，用於過濾裝備（推薦）
  className?: string;
}

