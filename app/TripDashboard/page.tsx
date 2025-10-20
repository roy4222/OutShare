import Navbar from "@/components/features/layout/Navbar";
import SideBar from "@/components/features/layout/SideBar";
import { TentTreeIcon } from "lucide-react";
export default function TripDashboardPage() {
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
                旅程管理 <TentTreeIcon className="size-5 text-green-700" />
              </h1>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}