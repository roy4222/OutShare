// 檔案路徑: lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types' // 💡 注意：建議自動生成您的資料庫類型

/**
 * 創建並導出一個 Supabase 客戶端 (Client-side) 實例。
 *
 * 這個實例用於在客戶端環境 (例如 React 的 Client Components)
 * 進行資料操作 (如讀取公開資料) 和身份驗證 (如登入/註冊/登出)。
 *
 * 由於它運行在瀏覽器中，它只使用 NEXT_PUBLIC_SUPABASE_ANON_KEY (匿名公鑰)，
 * 並且所有的資料存取都受到 RLS (Row Level Security) 的保護。
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