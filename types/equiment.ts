export interface Equipment {
  name: string;
  brand: string;
  weight: number;
  price: number;
  tags?: string[];
  buy_link?: string;
  image?: string;
  category: string; // 自定義群組
  trips?: string[]; // 旅程名稱
}