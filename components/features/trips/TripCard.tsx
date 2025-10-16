/**
 * TripCard 組件（重構版）
 *
 * 純展示組件，用於顯示單個旅程的基本資訊
 * 統計資料由外部傳入，不在組件內部計算
 */

import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LocationIcon } from "@/asset/icons/LocationIcon";
import { CalendarIcon } from "@/asset/icons/CalendarIcon";
import { PriceIcon } from "@/asset/icons/PriceIcon";
import { WeightIcon } from "@/asset/icons/WeightIcon";
import { TripCardProps } from "@/lib/types/trip";
import { cn } from "@/lib/utils";

const TripCard = ({ trip, stats, className }: TripCardProps) => {
  return (
    <Card
      className={cn(
        "w-80 md:w-100 cursor-pointer hover:shadow-lg transition-shadow duration-200",
        className
      )}
    >
      {/* 封面圖片 */}
      <div className="relative w-full h-64">
        <Image
          src={trip.image[0]}
          alt={trip.alt}
          fill
          className="object-cover"
        />
      </div>

      <CardHeader>
        {/* 旅程標題 */}
        <CardTitle className="text-base">{trip.title}</CardTitle>

        {/* 地點資訊 */}
        <CardDescription className="flex items-center gap-2">
          <LocationIcon />
          {trip.location}
        </CardDescription>

        {/* 旅程時長 */}
        <CardDescription className="flex items-center gap-2">
          <CalendarIcon />
          {trip.duration}
        </CardDescription>

        {/* 統計資訊 - 只在有 stats 時顯示 */}
        {stats && (
          <>
            {/* 總重量 */}
            <CardDescription className="flex items-center gap-2">
              <WeightIcon />
              {stats.totalWeight.toFixed(2)} 公斤
            </CardDescription>

            {/* 總價格 */}
            <CardDescription className="flex items-center gap-2">
              <PriceIcon />
              {stats.totalPrice.toLocaleString()} 元
            </CardDescription>
          </>
        )}

        {/* 標籤 */}
        <CardDescription className="flex items-center gap-2">
          <div className="flex items-center gap-1 pb-4 flex-wrap">
            {trip.tags.map((tag, index) => (
              <span key={index} className="text-sm text-green-800 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default TripCard;

