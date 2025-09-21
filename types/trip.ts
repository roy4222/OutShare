export interface Trip {
  id: string;
  title: string;
  image: string[];
  alt: string;
  location: string;
  duration: string;
  tags: string[];
  // 可選的詳細資訊欄位
  description?: string;
  equipment?: string[];
  // 裝備總重量和總價格（根據相關裝備計算得出）
  totalWeight?: number;  // 單位：公克
  totalPrice?: number;   // 單位：台幣
}

export interface TripCardProps {
  trip: Trip;
  className?: string;
}
