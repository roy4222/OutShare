// 檔案路徑: lib/supabase/middleware.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/lib/database.types'

/**
 * 在 Middleware 中創建 Supabase 客戶端實例。
 * 
 * 用於在路由請求處理前更新使用者的 session，確保 cookies 保持最新狀態。
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: 避免在這裡寫入任何邏輯會讓 `supabase.auth.getUser()` 和
  // `supabase.auth.getSession()` 之間產生競態條件 (race condition)
  // 簡單的例子是取得 user 資訊可確保 auth session 被更新
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 可選：根據使用者狀態進行路由保護
  // if (!user && !request.nextUrl.pathname.startsWith('/login')) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}

