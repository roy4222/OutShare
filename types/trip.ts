export interface Trip {
  id: string;
  title: string;
  image: string;
  alt: string;
  location: string;
  duration: string;
  tags: string[];
  // 可選的詳細資訊欄位
  description?: string;
  equipment?: string[];
  
}

export interface TripCardProps {
  trip: Trip;
  className?: string;
}
