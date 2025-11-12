/**
 * 公開個人檔案頁面
 *
 * 路徑: /profile/[username]
 * 權限: 公開（任何人都可以訪問）
 *
 * 功能:
 * - 根據 username 顯示使用者的公開資料
 * - 顯示該使用者的所有裝備（分類分組）
 * - 顯示個人簡介、頭像、社交連結
 */

"use client";

import { useParams } from "next/navigation";
import { useProfileByUsername } from "@/lib/hooks/useProfile";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import EquipmentList from "@/components/features/equipment/EquipmentList";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const { profile, isLoading, error } = useProfileByUsername(username);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">載入使用者資料中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">找不到該使用者</p>
          <p className="text-gray-500 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">找不到該使用者</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 個人資料區塊 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProfileHeader profile={profile} />
        </div>
      </div>

      {/* 裝備展示區塊 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.gearDashboardTitle || "我的裝備"}
          </h2>
        </div>

        <EquipmentList userId={profile.userId} />
      </div>
    </div>
  );
}
