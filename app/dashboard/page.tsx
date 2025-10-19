"use client";

import { useRequireAuth } from "@/lib/hooks/useAuth";
import Navbar from "@/components/features/layout/Navbar";

/**
 * 受保護的 Dashboard 頁面
 *
 * 這個頁面示範如何:
 * 1. 使用 useRequireAuth hook 來保護頁面
 * 2. 顯示使用者資訊
 * 3. 實作登出功能
 * 4. 當使用者未登入時，自動重導向到登入頁
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
      <Navbar />
    </div>
  );
}
