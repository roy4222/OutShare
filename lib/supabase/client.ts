// 檔案路徑: lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'

/**
 * ⚠️ 重要：此檔案僅用於 Supabase Auth 操作
 * 
 * 創建並導出一個 Supabase 客戶端 (Client-side) 實例。
 *
 * 🔐 **僅用於身份驗證操作**：
 * - `supabase.auth.signInWithOAuth()` - OAuth 登入
 * - `supabase.auth.signOut()` - 登出
 * - `supabase.auth.getUser()` - 獲取當前使用者
 * - `supabase.auth.getSession()` - 獲取 Session
 *
 * ❌ **不要用於資料庫查詢**：
 * - 資料庫查詢請使用 API Routes (`/api/trips`, `/api/equipment`, etc.)
 * - API Routes 內部使用 Prisma Client 連接資料庫
 * 
 * 📚 架構說明：
 * ```
 * 前端 Component → Hook (useTrips, useEquipment) 
 *                → API Route (/api/trips) 
 *                → Prisma Service (getTripList) 
 *                → Prisma Client 
 *                → PostgreSQL
 * ```
 */
export function createClient() {
  // 檢查環境變數是否已設定
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // 在開發階段拋出錯誤，避免程式運行時出錯
      throw new Error('Supabase URL or Key is missing in .env.local')
  }

  // 使用 createBrowserClient 來建立客戶端實例
  // Database 泛型 (Generic) 是可選的，但強烈推薦，可提供完整的 TypeScript 類型安全。
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// 導出一個常數實例，方便在整個 Client Components 中引用
export const supabaseClient = createClient()