/**
 * TripDialog 組件（重構版）
 *
 * 旅程詳細資訊彈窗，只負責對話框邏輯
 * 內容展示委派給 TripDetail 組件
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TripDialogProps } from "@/lib/types/trip";
import { cn } from "@/lib/utils";
import { useTripStats } from "@/lib/hooks/useTripStats";
import TripDetail from "./TripDetail";
import { LoadingSpinner } from "@/components/ui/loading/LoadingSpinner";

const TripDialog = ({ trip, trigger, className }: TripDialogProps) => {
  const { stats, isLoading } = useTripStats(trip.id);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className={cn(
          "sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-[100vh] md:max-h-[90vh] overflow-y-auto scrollbar-hide",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-left max-w-[80vw] overflow-hidden text-ellipsis whitespace-nowrap">
            {trip.title}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <LoadingSpinner size="sm" />
            <p className="mt-3 text-sm" style={{ color: "#54585A" }}>
              載入統計資料中...
            </p>
          </div>
        ) : (
          <TripDetail trip={trip} stats={stats} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TripDialog;

