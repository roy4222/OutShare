/**
 * TripList 組件
 * 
 * 顯示旅程列表，包含卡片和對話框
 */

"use client";

import { Trip } from "@/lib/types/trip";
import TripItemWithStats from "./TripItemWithStats";

interface TripListProps {
  trips: Trip[];
  className?: string;
}

const TripList = ({ trips, className }: TripListProps) => {
  return (
    <div className={className}>
      {trips.map((trip) => (
        <div key={trip.id} className="flex justify-center">
          <TripItemWithStats trip={trip} />
        </div>
      ))}
    </div>
  );
};

export default TripList;

