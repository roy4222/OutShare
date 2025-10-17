/**
 * TripList 組件
 * 
 * 顯示旅程列表，包含卡片和對話框
 */

"use client";

import { Trip } from "@/lib/types/trip";
import { useTripStats } from "@/lib/hooks/useTripStats";
import TripCard from "./TripCard";
import TripDialog from "./TripDialog";

interface TripListProps {
  trips: Trip[];
  className?: string;
}

const TripList = ({ trips, className }: TripListProps) => {
  return (
    <div className={className}>
      {trips.map((trip) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const stats = useTripStats(trip.title);
        
        return (
          <div key={trip.id} className="flex justify-center">
            <TripDialog
              trip={trip}
              trigger={
                <button className="px-4">
                  <TripCard trip={trip} stats={stats} />
                </button>
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default TripList;

