"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfile } from "@/lib/hooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OutshareLogo from "@/asset/logo/OutshareLogo";
import { CircleUserIcon, LogOutIcon, MenuIcon, MessageCircleMoreIcon } from "lucide-react";
import { useState } from "react";
import BetaLogo from "@/asset/logo/BetaLogo";
import { ExternalLinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Navbar 導航列元件
 *
 * 提供應用程式的主導航列，包含：
 * - Logo（左側）
 * - 使用者頭像和下拉選單（桌面版右側）
 * - 漢堡選單（手機版）
 * - 登出功能
 *
 * @example
 * ```tsx
 * <Navbar />
 * ```
 */
const DEFAULT_DISPLAY_NAME = "使用者";

const Navbar = () => {
  const { user, loading, signOut } = useAuth();
  const profile = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * 處理登出
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      // 登出後會自動重導向到首頁（由 useAuth 處理）
    } catch (error) {
      console.error("登出失敗:", error);
      alert("登出時發生錯誤，請稍後再試");
    }
  };

  /**
   * 取得使用者名稱縮寫（用於頭像 fallback）
   */
  const getInitials = (displayName: string) => {
    if (!displayName) return "U";
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  };

  const router = useRouter();

  const resolvedDisplayName = user
    ? profile.displayName?.trim() ||
      user.user_metadata?.full_name?.trim() ||
      profile.username?.trim() ||
      user.email ||
      DEFAULT_DISPLAY_NAME
    : DEFAULT_DISPLAY_NAME;

  const avatarSrc = user
    ? profile.avatar?.trim() ||
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      undefined
    : undefined;

  const avatarFallback = getInitials(resolvedDisplayName);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - 左側 */}
          <div className="flex-shrink-0">
            <Link
              href="/GearDashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <OutshareLogo />
              <div className="w-12 h-12 flex items-center justify-center">
                <BetaLogo />
              </div>
            </Link>
          </div>

          {/* 桌面版 - 使用者選單（右側） */}
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              className="group bg-white border-2 border-green-700 hover:bg-green-700 relative mx-6 px-2 py-2 rounded-md  focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer"
              onClick={() => window.open("/profile", "_blank")}
            >
              <span className="text-green-700 group-hover:text-white font-bold text-base">
                前往前台
              </span>
              <ExternalLinkIcon className="text-green-700 group-hover:text-white" />
            </Button>
            {loading ? (
              // 載入狀態
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              // 已登入：顯示頭像下拉選單
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={avatarSrc}
                        alt={resolvedDisplayName}
                      />
                      <AvatarFallback className="bg-brand-primary text-white">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {resolvedDisplayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => router.push("/ProfileEdit")}
                  >
                    <CircleUserIcon className="mr-2 h-4 w-4" />
                    個人檔案
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => router.push("/feedback")}
                  >
                    <MessageCircleMoreIcon className="mr-2 h-4 w-4" />
                    功能回饋
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    登出
                  </DropdownMenuItem>
                  
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>

          {/* 手機版 - 漢堡選單（右側） */}
          <div className="md:hidden flex items-center">
            {loading ? (
              // 載入狀態
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              // 已登入：顯示漢堡選單
              <DropdownMenu
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="focus-visible:ring-2 focus-visible:ring-offset-2 "
                  >
                    <MenuIcon className="h-8 w-8" />
                    <span className="sr-only">開啟選單</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white" align="end">
                  {/* 使用者資訊 */}
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarSrc} alt={resolvedDisplayName} />
                        <AvatarFallback className="bg-brand-primary text-white">
                          {avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {resolvedDisplayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* 登出按鈕 */}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    登出
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
