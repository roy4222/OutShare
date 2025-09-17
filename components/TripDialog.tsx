import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { Trip } from "@/types/trip";
import { cn } from "@/lib/utils";
import EquimentCard from "./EquimentCard";

interface TripDialogProps {
  trip: Trip;
  trigger: React.ReactNode;
  className?: string;
}

/**
 * 旅程詳細資訊彈窗組件
 *
 * 用於顯示旅程的完整詳細資訊，包含：
 * - 大尺寸封面圖片
 * - 完整的旅程描述
 * - 詳細的地點和時長資訊
 * - 所有相關標籤
 * - 可能的額外資訊（如費用、難度等）
 *
 * @param trip - 旅程資料物件
 * @param trigger - 觸發彈窗的元素（通常是 TripCard）
 * @param className - 可選的額外 CSS 類名
 * @returns JSX.Element - 渲染的旅程詳細資訊彈窗
 */
const TripDialog = ({ trip, trigger, className }: TripDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className={cn(
          "sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{trip.title}</DialogTitle>
        </DialogHeader>

        

        <div className="space-y-6">
          {/* 大尺寸圖片 */}
          <div className="relative w-full h-80 rounded-lg overflow-hidden">
            <Image
              src={trip.image}
              alt={trip.alt}
              fill
              className="object-cover"
              priority
            />
          </div>

           {/* 標籤區域 */}
           <div className="flex items-center gap-2 flex-wrap">
              {trip.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="text-sm px-3 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>

          {/* 基本資訊 */}
          <div className="space-y-4">
            {/* 地點資訊 */}
            <div className="flex items-center gap-3 text-base">
              <LocationIcon />
              <span className="font-medium"> 地點：{trip.location}</span>
            </div>

            {/* 時長資訊 */}
            <div className="flex items-center gap-3 text-base">
              <CalendarIcon />
              <span className="font-medium"> 日期：{trip.duration}</span>
            </div>
          </div>

         

          {/* 詳細描述區域 */}
          {trip.description && (
            <div className="space-y-3">
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {trip.description}
              </div>
            </div>
          )}
          {/* 使用裝備區域 */}
          <div className="space-y-3">
            <EquimentCard tripTitle={trip.title} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripDialog;
