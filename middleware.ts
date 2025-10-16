// 檔案路徑: middleware.ts

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js Middleware - 在每個請求處理前執行
 * 
 * 用於更新 Supabase session，確保使用者的認證狀態保持最新。
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * 配置 Middleware 要處理的路徑
 * 
 * matcher 設定讓 Middleware 作用於所有路徑，
 * 除了靜態資源 (_next/static)、圖片 (_next/image)、favicon 等
 */
export const config = {
  matcher: [
    /*
     * 匹配所有請求路徑，除了以下開頭的:
     * - _next/static (靜態檔案)
     * - _next/image (圖片優化檔案)
     * - favicon.ico (網站圖標)
     * - 檔案副檔名 (例如: .svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

