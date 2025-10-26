"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/features/layout/Navbar";
import SideBar from "@/components/features/layout/SideBar";
import { CategoryModal } from "@/components/features/dashboard";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { FolderCodeIcon, SquarePenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProtectedUser } from "@/lib/hooks/useProtectedUser";
/**
 * 受保護的 GearDashboard 頁面
 *
 * 這個頁面示範如何:
 * 1. 透過 AuthGuard 集中處理認證
 * 2. 顯示使用者資訊
 * 3. 實作登出功能
 * 4. 整合 Sidebar 側邊導航欄
 */
export default function GearDashboardPage() {
  const user = useProtectedUser();

  // 彈窗狀態
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 標題狀態
  const [dashboardTitle, setDashboardTitle] = useState<string>("我的裝備");
  const [isTitleLoading, setIsTitleLoading] = useState(true);

  // 載入使用者的自訂標題
  useEffect(() => {
    const loadDashboardTitle = async () => {
      try {
        const response = await fetch("/api/profiles");
        const result = await response.json();

        if (result.data?.dashboard_title) {
          setDashboardTitle(result.data.dashboard_title);
        }
      } catch (error) {
        console.error("Error loading dashboard title:", error);
      } finally {
        setIsTitleLoading(false);
      }
    };

    loadDashboardTitle();
  }, [user]);

  // 處理標題儲存
  const handleSaveTitle = async (newTitle: string) => {
    // 驗證標題
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error("標題不可為空");
    }

    if (newTitle.length > 50) {
      throw new Error("標題長度不可超過 50 字元");
    }

    const response = await fetch("/api/profiles", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dashboard_title: newTitle.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || "儲存失敗");
    }

    // 更新本地狀態
    setDashboardTitle(newTitle);
  };

  if (isTitleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航列 */}
      <Navbar />

      {/* 主要內容區域 */}
      <div className="flex">
        {/* 側邊導航欄 */}
        <SideBar />

        {/* 主內容區（預留空間給 Sidebar，左邊距 256px = w-64） */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {dashboardTitle}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="編輯標題"
                >
                  <SquarePenIcon className="size-5 text-green-700" />
                </button>
              </h1>
              <div className="flex bg-green-700 text-white rounded-md">
                <Button>+ 新增類別</Button>
              </div>
            </div>
            {/* Empty State UI */}
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderCodeIcon className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle>新增類別</EmptyTitle>
                  <EmptyDescription>
                    開始新增你的第一個裝備，建立你的裝備清單
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex bg-green-700  text-white rounded-md ">
                    <Button>+ 新增類別</Button>
                  </div>
                </EmptyContent>
              </Empty>
            </div>
          </div>
        </main>
      </div>

      {/* 標題編輯彈窗 */}
      <CategoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTitle={dashboardTitle}
        onSave={handleSaveTitle}
      />
    </div>
  );
}
