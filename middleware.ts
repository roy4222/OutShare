// 檔案路徑: middleware.ts

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js Middleware
 * 
 * 在每個請求執行前更新使用者的 Supabase session。
 * 這確保了:
 * 1. 使用者的認證狀態在每次請求時都是最新的
 * 2. Session tokens 在過期前自動更新
 * 3. Cookies 中的認證資料保持同步
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * Middleware 配置
 * 
 * 指定哪些路由需要執行 middleware。
 * 這裡排除了靜態資源和 Next.js 內部路由。
 */
export const config = {
  matcher: [
    /*
     * 匹配所有路由，除了:
     * - _next/static (靜態檔案)
     * - _next/image (圖片優化檔案)
     * - favicon.ico (網站圖示)
     * - public 目錄中的檔案 (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

