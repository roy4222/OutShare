"use client";

import { useState } from "react";
import ModalCard from "@/components/ModalCard";
import ProfileBlock from "@/components/profileBlock";
import TripsToogleGroup from "@/components/TripsToogleGroup";

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<string>("trips");

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-8 max-w-lg mx-auto">
      <main className="container">
          <ProfileBlock />
        <div className="flex items-center justify-center pb-4">
          <TripsToogleGroup 
            value={selectedTab} 
            onValueChange={handleTabChange} 
          />
        </div>
        {selectedTab === "trips" && (
          <div className="w-full flex items-center justify-center ">
            <ModalCard />
          </div>
        )}
        {selectedTab === "gear" && (
          <div className="w-full flex items-center justify-center">
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold">Gear Section</h2>
              <p>這裡可以顯示裝備相關內容</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
