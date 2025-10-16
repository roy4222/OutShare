// 檔案路徑: lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

/**
 * 創建並導出一個 Supabase Server 客戶端實例。
 * 
 * 這個實例用於在 Server Components、Server Actions 和 Route Handlers 中
 * 進行需要認證的資料操作。
 * 
 * Server client 會自動處理 cookies 的讀取和寫入，確保使用者的 session 狀態
 * 在 server 端也能被正確識別。
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 在 Server Components 中可能會拋出錯誤
            // 這是正常的,因為 cookies 只能在 Server Actions 或 Route Handlers 中寫入
          }
        },
      },
    }
  )
}

