// 檔案路徑: lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

/**
 * ⚠️ 重要：此檔案僅用於 Supabase Auth 操作
 * 
 * 創建並導出一個 Supabase Server 客戶端實例。
 * 
 * 🔐 **僅用於身份驗證操作**：
 * - `supabase.auth.getUser()` - 在 API Routes 中獲取當前使用者
 * - `supabase.auth.exchangeCodeForSession()` - OAuth callback 處理
 * - `supabase.auth.getSession()` - 獲取 Session
 * 
 * ❌ **不要用於資料庫查詢**：
 * - 資料庫查詢請使用 Prisma Services：
 *   - `import { getTripList } from '@/lib/services/prisma'`
 *   - `import { getEquipmentList } from '@/lib/services/prisma'`
 *   - `import { getProfileByUserId } from '@/lib/services/prisma'`
 * 
 * 📚 在 API Routes 中的使用範例：
 * ```typescript
 * // API Route: app/api/trips/route.ts
 * import { createClient } from '@/lib/supabase/server';
 * import { getTripList } from '@/lib/services/prisma';
 * 
 * export async function GET(request: NextRequest) {
 *   // 1. 使用 Supabase Auth 驗證使用者
 *   const supabase = await createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   
 *   // 2. 使用 Prisma Service 查詢資料
 *   const { data, error } = await getTripList({ userId: user?.id });
 *   return NextResponse.json({ data });
 * }
 * ```
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

