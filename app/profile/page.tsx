/**
 * 使用者公開展示頁面
 * 
 * 展示使用者的個人資料、旅程和裝備
 * 這是公開頁面，任何人都可以訪問
 */

"use client";

import { ProfileHeader, SocialLinks } from "@/components/features/profile";
import { TripList } from "@/components/features/trips";
import { EquipmentList } from "@/components/features/equipment";
import { TripsToggleGroup } from "@/components/features/layout";
import { useProfile } from "@/lib/hooks/useProfile";
import { tripsData } from "@/data/trips";

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-8 max-w-lg mx-auto">
      <main className="container">
        {/* 個人資料區塊 */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <ProfileHeader profile={profile} />
          {profile.socialLinks && <SocialLinks links={profile.socialLinks} className="mt-4" />}
        </div>

        {/* 旅行/裝備切換標籤頁 */}
        <TripsToggleGroup
          tripsContent={
            <div className="w-full space-y-4 px-4">
              <TripList trips={tripsData} />
            </div>
          }
          gearContent={
            <div className="w-full space-y-4 px-4">
              <div className="flex justify-center">
                <div className="w-80 md:w-100">
                  <EquipmentList />
                </div>
              </div>
            </div>
          }
        />
      </main>
    </div>
  );
}
