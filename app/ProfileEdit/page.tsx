import Navbar from "@/components/features/layout/Navbar";
import SideBar from "@/components/features/layout/SideBar";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { PencilIcon, ArrowLeftIcon, HomeIcon, CircleUserIcon } from "lucide-react";
import Link from "next/link";
export default function ProfileEditPage() {
  return (
    <div>
      <Navbar />
      <SideBar />
      <div className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            個人檔案 <PencilIcon className="size-5 text-green-700" />
          </h1>
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CircleUserIcon className="size-8 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle className="text-xl">個人檔案編輯功能</EmptyTitle>
                <EmptyDescription className="text-base max-w-md">
                  我們正在精心準備個人檔案編輯功能，讓您能夠輕鬆管理您的個人資訊。這個功能即將推出，敬請期待！
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/profile" className="flex items-center gap-2">
                      <ArrowLeftIcon className="size-4" />
                      查看個人檔案
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
      </div>
    </div>
  );
}