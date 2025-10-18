/**
 * TripItemWithStats 組件
 * 
 * 包裝 TripCard 和 TripDialog，並處理統計資料的獲取
 * 這個組件負責調用 useTripStats hook
 */

"use client";

import { Trip } from "@/lib/types/trip";
import { useTripStats } from "@/lib/hooks/useTripStats";
import TripCard from "./TripCard";
import TripDialog from "./TripDialog";

interface TripItemWithStatsProps {
  trip: Trip;
}

const TripItemWithStats = ({ trip }: TripItemWithStatsProps) => {
  const { stats, isLoading } = useTripStats(trip.id);

  return (
    <TripDialog
      trip={trip}
      trigger={
        <button className="px-4">
          <TripCard 
            trip={trip} 
            stats={isLoading ? undefined : stats} 
          />
        </button>
      }
    />
  );
};

export default TripItemWithStats;

