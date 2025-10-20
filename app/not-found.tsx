"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/features/layout/Navbar";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="text-center space-y-6 max-w-md mx-auto">

          {/* 404 圖標或數字 */}
          <div className="text-8xl font-bold text-muted-foreground mb-4">
            404
          </div>

          {/* 錯誤標題 */}
          <h1 className="text-2xl font-semibold text-foreground">
            頁面未找到
          </h1>

          {/* 錯誤描述 */}
          <p className="text-muted-foreground leading-relaxed">
            抱歉，您訪問的頁面不存在。可能是網址輸入錯誤，或該頁面已被移動或刪除。
          </p>

          {/* 返回首頁按鈕 */}
          <div className="pt-4">
            <Button
              onClick={handleGoHome}
              size="lg"
              className="w-full sm:w-auto"
              aria-label="返回首頁"
            >
              返回首頁
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
