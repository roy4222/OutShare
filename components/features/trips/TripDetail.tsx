/**
 * TripDetail 組件
 * 
 * 顯示旅程的詳細資訊，包含：
 * - 圖片輪播
 * - 基本資訊（地點、時長、統計）
 * - 標籤
 * - 詳細描述
 * - 相關裝備
 */

"use client";

import { LocationIcon } from "@/asset/icons/LocationIcon";
import { CalendarIcon } from "@/asset/icons/CalendarIcon";
import { WeightIcon } from "@/asset/icons/WeightIcon";
import { PriceIcon } from "@/asset/icons/PriceIcon";
import { TripDetailProps } from "@/lib/types/trip";
import { cn } from "@/lib/utils";
import SwiperCarousel from "@/components/SwiperCarousel";
import SwiperPagination from "@/components/ui/swiper-pagination";
import { useSwiperControl } from "@/lib/hooks/useSwiperControl";
import { EquipmentList } from "@/components/features/equipment";

const TripDetail = ({ trip, stats, className }: TripDetailProps) => {
  const { swiperRef, paginationRef, handleSlideChange, handlePaginationClick } =
    useSwiperControl();

  return (
    <div className={cn("space-y-2 min-w-0", className)}>
      {/* 圖片輪播 */}
      <div className="relative h-64 md:h-80">
        <SwiperCarousel
          ref={swiperRef}
          images={trip.image}
          alt={trip.alt}
          className="trip-dialog-swiper"
          onSlideChange={handleSlideChange}
        />
      </div>

      {/* Pagination */}
      <div onClick={handlePaginationClick} className="flex justify-center">
        <SwiperPagination
          ref={paginationRef}
          totalSlides={trip.image.length}
          clickable={true}
        />
      </div>

      {/* 基本資訊 */}
      <div className="space-y-2">
        {/* 地點 */}
        <div className="flex items-center gap-3 text-base">
          <LocationIcon />
          <span>{trip.location}</span>
        </div>

        {/* 時長 */}
        <div className="flex items-center gap-3 text-base">
          <CalendarIcon />
          <span>{trip.duration}</span>
        </div>

        {/* 總重量 */}
        <div className="flex items-center gap-3 text-base">
          <WeightIcon />
          <span>{stats.totalWeight.toFixed(2)} 公斤</span>
        </div>

        {/* 總價格 */}
        <div className="flex items-center gap-3 text-base">
          <PriceIcon />
          <span>{stats.totalPrice.toLocaleString()} 元</span>
        </div>
      </div>

      {/* 標籤 */}
      <div className="flex items-center gap-2 flex-wrap">
        {trip.tags.map((tag, index) => (
          <span key={index} className="text-sm text-green-800 rounded-md pb-2">
            {tag}
          </span>
        ))}
      </div>

      {/* 詳細描述 */}
      {trip.description && (
        <div className="space-y-3">
          <div className="text-gray-600 leading-relaxed whitespace-pre-line">
            {trip.description}
          </div>
        </div>
      )}

      {/* 使用裝備 */}
      <div className="space-y-3">
        <EquipmentList tripId={trip.id} />
      </div>
    </div>
  );
};

export default TripDetail;

