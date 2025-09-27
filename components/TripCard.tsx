import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { TripCardProps } from "@/types/trip";
import { calculateTripEquipmentTotals, cn } from "@/lib/utils";
import { PriceIcon } from "./icons/PriceIcon";
import { WeightIcon } from "./icons/WeightIcon";

/**
 * 旅程卡片組件
 *
 * 用於顯示單個旅程的基本資訊，包含：
 * - 旅程封面圖片
 * - 旅程標題
 * - 地點資訊（配合位置圖標）
 * - 旅程時長（配合日曆圖標）
 * - 相關標籤
 *
 * 這個組件專注於展示功能，可以作為觸發器被包裝在其他交互組件中
 *
 * @param trip - 旅程資料物件，包含 id、title、image、location、duration、tags 等屬性
 * @param className - 可選的額外 CSS 類名，用於自定義樣式
 * @returns JSX.Element - 渲染的旅程卡片組件
 */
const TripCard = ({ trip, className }: TripCardProps) => {
  const { totalWeight, totalPrice } = calculateTripEquipmentTotals(trip.title);
  return (
    <Card
      className={cn(
        "w-80 md:w-100 cursor-pointer hover:shadow-lg transition-shadow duration-200 ",
        className
      )}
    >
      <div className="relative w-full h-64">
        <Image
          src={trip.image[0]} // 旅程封面圖片路徑
          alt={trip.alt} // 圖片替代文字，提升無障礙性
          fill // 填滿父容器
          className="object-cover" // 保持圖片比例並裁切以填滿容器
        />
      </div>

      {/* 卡片標題區域 */}
      <CardHeader>
        {/* 旅程標題 */}
        <CardTitle className="text-base">{trip.title}</CardTitle>

        {/* 地點資訊 - 使用 flex 佈局將圖標和文字水平排列 */}
        <CardDescription className="flex items-center gap-2">
          <LocationIcon />
          {trip.location}
        </CardDescription>

        {/* 旅程時長 - 使用 flex 佈局將圖標和文字水平排列 */}
        <CardDescription className="flex items-center gap-2">
          <CalendarIcon />
          {trip.duration}
        </CardDescription>

        {/* 統計資訊區域 */}
        <CardDescription className="flex items-center gap-2">
          {/* 總重量資訊 */}
          <WeightIcon />
          總重量：{totalWeight.toFixed(2)} kg
        </CardDescription>

        {/* 總價格資訊 */}
        <CardDescription className="flex items-center gap-2">
          <PriceIcon />
          總價格：{totalPrice.toLocaleString()} NTD
        </CardDescription>
        <CardDescription className="flex items-center gap-2">
        {/* 標籤容器 - 使用 flex-wrap 讓標籤可以換行顯示 */}
        <div className="flex items-center gap-1 pb-4 flex-wrap">
          {/* 遍歷旅程標籤陣列，為每個標籤建立一個 Badge 組件 */}
          {trip.tags.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
        </CardDescription>
      </CardHeader>

    </Card>
  );
};

export default TripCard;
