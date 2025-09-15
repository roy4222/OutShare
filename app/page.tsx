"use client";

import ModalCard from "@/components/ModalCard";
import ProfileBlock from "@/components/profileBlock";
import TripsToogleGroup from "@/components/TripsToogleGroup";

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
            <div className="w-full flex items-center justify-center ">
              <ModalCard />
            </div>
          }
          //Gear 標籤頁內容：顯示裝備相關內容
          gearContent={
            <div className="w-full flex items-center justify-center">
              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold">Gear Section</h2>
                <p>這裡可以顯示裝備相關內容</p>
              </div>
            </div>
          }
        />
      </main>
    </div>
  );
}
