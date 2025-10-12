"use client";

import TripCard from "@/components/TripCard";
import TripDialog from "@/components/TripDialog";
import ProfileBlock from "@/components/profileBlock";
import TripsToogleGroup from "@/components/TripsToogleGroup";
import { tripsData } from "@/data/trips";
import EquimentCard from "@/components/EquimentCard";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-8 max-w-lg mx-auto">
      <main className="container">
        {/* 個人資料區塊 */}
        <ProfileBlock />
        {/* 旅行/裝備切換標籤頁組件 */}
        <TripsToogleGroup
          //Trips 標籤頁內容：顯示旅行卡片
          tripsContent={
            <div className="w-full space-y-4 px-4">
              {tripsData.map((trip) => (
                <div key={trip.id} className="flex justify-center">
                  <TripDialog
                    trip={trip}
                    trigger={
                      <button className="px-4">
                        <TripCard trip={trip} />
                      </button>
                    }
                  />
                </div>
              ))}
            </div>
          }
          //Gear 標籤頁內容：顯示裝備相關內容
          gearContent={
            <div className="w-full space-y-4 px-4">
              <div className="flex justify-center">
                <div className="w-80 md:w-100">
                  <EquimentCard />
                </div>
              </div>
            </div>
          }
        />
      </main>
    </div>
  );
}
