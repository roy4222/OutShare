// 檔案路徑: app/auth/callback/route.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureProfileForUser } from '@/lib/services/prisma'
import type { User } from '@supabase/supabase-js'

/**
 * OAuth Callback Route Handler
 * 
 * 處理 Google OAuth 登入後的回調，將授權碼換成使用者 session。
 * 登入成功後，重導向到個人資料頁面或指定的頁面。
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // 判斷是否為生產環境（檢查 request headers 中的 host）
  const host = request.headers.get('host') || ''
  const isProduction = host.includes('outshare.roy422.ggff.net') || host.includes('roy422roy.workers.dev')
  
  // 如果是生產環境但 URL 是 localhost，強制使用生產環境 URL
  let origin: string
  if (isProduction || process.env.NEXT_PUBLIC_SITE_URL) {
    origin = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`
  } else {
    origin = requestUrl.origin
  }
  
  // 在 WSL 本地開發環境中，origin 可能是 0.0.0.0，需要轉換成 localhost
  if (origin.includes('0.0.0.0')) {
    origin = origin.replace('0.0.0.0', 'localhost')
  }
  
  const next = requestUrl.searchParams.get('next') ?? '/GearDashboard'

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
        let user: User | null = data.user ?? null

        if (!user) {
          const { data: userData, error: getUserError } =
            await supabase.auth.getUser()
          if (getUserError) {
            console.error('Failed to fetch user after session exchange:', getUserError)
          }
          user = userData.user ?? null
        }

        if (!user) {
          console.error('Profile sync aborted: unable to resolve Supabase user')
          return NextResponse.redirect(
            `${origin}/auth/auth-code-error?reason=user-missing`
          )
        }

        const { error: ensureError } = await ensureProfileForUser({
          userId: user.id,
          email: user.email,
          metadata: user.user_metadata as Record<string, unknown>,
        })

        if (ensureError) {
          console.error('Profile sync failed:', ensureError)
          return NextResponse.redirect(
            `${origin}/auth/auth-code-error?reason=profile-sync`
          )
        }

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
