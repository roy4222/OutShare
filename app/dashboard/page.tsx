"use client";

import { useRequireAuth } from "@/lib/hooks/useAuth";
import Navbar from "@/components/features/layout/Navbar";
import SideBar from "@/components/features/layout/SideBar";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { FolderCodeIcon,PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
/**
 * 受保護的 Dashboard 頁面
 *
 * 這個頁面示範如何:
 * 1. 使用 useRequireAuth hook 來保護頁面
 * 2. 顯示使用者資訊
 * 3. 實作登出功能
 * 4. 當使用者未登入時，自動重導向到登入頁
 * 5. 整合 Sidebar 側邊導航欄
 */
export default function DashboardPage() {
  // 使用 useRequireAuth hook，自動處理認證邏輯
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return null; // 將會重導向到首頁
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
                裝備管理 <PencilIcon className="size-5 text-green-700" />
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
    </div>
  );
}
