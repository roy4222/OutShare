import Navbar from "@/components/features/layout/Navbar";
import SideBar from "@/components/features/layout/SideBar";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { TentTreeIcon, ArrowLeftIcon, HomeIcon, MapIcon } from "lucide-react";
import Link from "next/link";
export default function TripDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航列 */}
      <Navbar />

      {/* 主要內容區域 */}
      <div className="flex pt-16">
        {/* 側邊導航欄 */}
        <SideBar />

        {/* 主內容區（預留空間給 Sidebar，左邊距 256px = w-64） */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              旅程管理 <TentTreeIcon className="size-5 text-green-700" />
            </h1>

            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MapIcon className="size-8 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle className="text-xl">旅程管理功能</EmptyTitle>
                  <EmptyDescription className="text-base max-w-md">
                    我們正在精心準備旅程管理功能，讓您能夠輕鬆規劃和追蹤您的戶外探險。這個功能即將推出，敬請期待！
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/TripDashboard" className="flex items-center gap-2">
                        <ArrowLeftIcon className="size-4" />
                        查看現有旅程
                      </Link>
                    </Button>
                    <Button asChild variant="default" size="sm">
                      <Link href="/" className="flex items-center gap-2">
                        <HomeIcon className="size-4" />
                        返回首頁
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    有任何問題或建議？歡迎聯繫我們的支援團隊
                  </p>
                </EmptyContent>
              </Empty>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}