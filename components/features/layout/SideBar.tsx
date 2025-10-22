"use client";

import { CircleUserIcon, MessageCircleMoreIcon,TentIcon,TentTreeIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { NavItem } from "@/lib/types";

/**
 * SideBar 側邊導航欄元件
 *
 * 提供 Dashboard 主要功能的快捷導航入口，包含：
 * - 裝備管理
 * - 旅程管理（即將上線）
 * - 個人檔案
 * - 功能回饋
 *
 * 功能特色：
 * - 自動高亮目前所在路由
 * - 支援路由跳轉
 * - 可禁用尚未開放的功能
 *
 * @example
 * ```tsx
 * <SideBar />
 * ```
 */
const SideBar = () => {
  const router = useRouter();

  /**
   * 導航選項配置
   */
  const navItems: NavItem[] = [
    {
      id: "equipment",
      label: "我的裝備",
      icon: TentIcon,
      href: "/GearDashboard",
    },
    {
      id: "trips",
      label: "我的旅程",
      icon: TentTreeIcon,
      href: "/TripDashboard",
      badge: {
        text: "即將上線",
        variant: "secondary",
        className:
          "bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-white border-0",
      },
    },
    {
      id: "profile",
      label: "個人檔案",
      icon: CircleUserIcon,
      href: "/ProfileEdit",
    },
    {
      id: "feedback",
      label: "功能回饋",
      icon: MessageCircleMoreIcon,
      href: "/feedback",
    },
  ];

  return (
    <aside
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 flex flex-col"
      role="navigation"
      aria-label="主要導航"
    >
      {/* 導航選項列表 */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ id, icon: Icon, label, href, badge }) => (
          <Button
            key={id}
            variant="ghost"
            onClick={() => router.push(href)}
            className="group relative w-full justify-start gap-3 h-auto py-3 text-grey-800 hover:text-green-700"
            aria-label={label}
          >
            {/* 圖標 */}
            <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />

            {/* 文字標籤 */}
            <span className="font-mono text-base">{label}</span>

            {/* Badge（如果有） */}
            {badge && (
              <Badge
                variant={badge.variant || "default"}
                className={badge.className}
              >
                {badge.text}
              </Badge>
            )}
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
