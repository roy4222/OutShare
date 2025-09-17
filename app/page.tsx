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
                      <button>
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
            <div className="w-full flex items-center justify-center">
              <div className="p-4 text-center">
                <EquimentCard />
              </div>
            </div>
          }
        />
      </main>
    </div>
  );
}
