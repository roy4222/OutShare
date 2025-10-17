// 檔案路徑: app/auth/callback/route.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * OAuth Callback Route Handler
 * 
 * 處理 Google OAuth 登入後的回調，將授權碼換成使用者 session。
 * 登入成功後，重導向到個人資料頁面或指定的頁面。
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    try {
      // 將 OAuth 授權碼換成使用者 session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Exchange code error:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      if (data.session) {
        console.log('Login successful, redirecting to:', next)
        // 登入成功，重導向到目標頁面
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('Unexpected error during code exchange:', err)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
  }

  // 沒有 code 參數或其他錯誤
  console.error('No code parameter found')
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
