// 檔案路徑: app/auth/auth-code-error/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * OAuth 錯誤頁面
 * 
 * 當 OAuth callback 處理失敗時，使用者會被重導向到這個頁面。
 */
export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            登入發生錯誤
          </h1>
          <p className="text-gray-600 mb-6">
            很抱歉，在處理您的登入請求時發生了錯誤。
            請稍後再試一次。
          </p>
          <Link href="/">
            <Button className="w-full">
              返回首頁
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

