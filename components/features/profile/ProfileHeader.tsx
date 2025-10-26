/**
 * ProfileHeader 組件
 * 
 * 顯示使用者個人資料標題區域，包含：
 * - 頭像
 * - 顯示名稱
 * - 個人簡介
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileHeaderProps } from "@/lib/types/profile";
import { cn } from "@/lib/utils";

const ProfileHeader = ({ profile, className }: ProfileHeaderProps) => {
  const displayName =
    (profile.displayName && profile.displayName.trim()) ||
    profile.username ||
    'User';
  const avatarFallback = displayName.substring(0, 2).toUpperCase();
  const avatarSrc =
    profile.avatar && profile.avatar.trim().length > 0
      ? profile.avatar
      : undefined;

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* 頭像 */}
      <Avatar>
        <AvatarImage src={avatarSrc} alt={displayName} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>

      {/* 顯示名稱 */}
      <div className="text-2xl font-bold mt-4">{displayName}</div>

      {/* 個人簡介 */}
      {profile.bio && (
        <div className="text-base mt-2 text-gray-500 text-center">
          {profile.bio}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;

