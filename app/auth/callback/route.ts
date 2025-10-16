// 檔案路徑: app/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

/**
 * OAuth Callback Route Handler
 * 
 * 當使用者從 Google OAuth 頁面完成認證後，會被重導向到這個路由。
 * 此路由負責:
 * 1. 接收 OAuth 返回的 code
 * 2. 將 code 交換為 session (包含 access token 和 refresh token)
 * 3. 將使用者重導向到應用程式的主頁或原本想訪問的頁面
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 登入成功後重導向到個人資料頁面
  // 可以透過 URL 參數 next 來自訂重導向位置
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // 將 OAuth code 交換為 session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 成功建立 session，重導向到目標頁面
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // 開發環境: 重導向到本地 URL
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // 正式環境: 使用 forwarded host
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        // fallback: 使用 origin
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // 如果發生錯誤，重導向到錯誤頁面
  // 可以在 URL 中加入錯誤訊息供前端顯示
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

