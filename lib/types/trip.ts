/**
 * 旅程相關型別定義
 */

/**
 * 旅程資料模型（Domain Model）
 */
export interface Trip {
  id: string;
  title: string;
  image: string[];
  alt: string;
  location: string;
  duration: string;
  tags: string[];
  description?: string;
  equipment?: string[]; // 裝備 ID 列表（未來擴展用）
}

/**
 * 旅程統計資料（View Model）
 */
export interface TripStats {
  totalWeight: number; // 單位：公斤
  totalPrice: number; // 單位：台幣
  equipmentCount: number; // 裝備數量
}

/**
 * 旅程卡片組件 Props
 */
export interface TripCardProps {
  trip: Trip;
  stats?: TripStats; // 統計資料改為可選，由外部傳入
  className?: string;
}

/**
 * 旅程詳細資訊組件 Props
 */
export interface TripDetailProps {
  trip: Trip;
  stats: TripStats;
  className?: string;
}

/**
 * 旅程對話框組件 Props
 */
export interface TripDialogProps {
  trip: Trip;
  trigger: React.ReactNode;
  className?: string;
}

