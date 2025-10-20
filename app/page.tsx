"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { GoogleIcon } from "@/asset/icons/GoogleIcon";
import SignUpLogo from "@/asset/logo/SignUpLogo";
import OutshareLogo from "@/asset/logo/OutshareLogo";
import BetaLogo from "@/asset/logo/BetaLogo";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // 檢查使用者是否已登入，如果是則自動跳轉到 profile 頁面
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/GearDashboard");
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  /**
   * 處理 Google 登入
   * 
   * 使用 Supabase Auth 的 signInWithOAuth 方法啟動 Google OAuth 流程。
   * 使用者會被重導向到 Google 登入頁面，登入後會回到 /auth/callback 路由。
   */
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // 使用當前瀏覽器的 origin（使用者已經在正確的網域上）
      const currentOrigin = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // 指定 OAuth 完成後的 callback URL
          redirectTo: `${currentOrigin}/auth/callback`,
          // 可選: 要求 Google 提供 refresh token (用於長期存取 Google API)
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google 登入錯誤:', error.message);
        alert('登入時發生錯誤，請稍後再試');
      }
      // 如果成功，使用者會被自動重導向到 Google 登入頁面
    } catch (error) {
      console.error('未預期的錯誤:', error);
      alert('登入時發生錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo 和標語區塊 */}
        <div className="flex flex-col items-center space-y-4">
          {/* 主要 Logo 動畫 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <SignUpLogo />
          </motion.div>
          {/* 品牌 Logo 動畫和 Beta Logo */}
          <motion.div
            className="max-w-60 mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-4">
              <OutshareLogo />
              <BetaLogo />
            </div>
          </motion.div>
          {/* 標語文字動畫 */}
          <motion.div
            className="text-base text-gray-500"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            開始記錄分享，你的戶外旅程與裝備吧！
          </motion.div>
        </div>

        {/* Google 登入按鈕 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <Button
            className="w-full h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-800 border-2 rounded-3xl border-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <span className="text-base font-medium flex items-center justify-start p-4 w-full">
              {/* Google 圖標 */}
              <div className="flex-shrink-0">
                <GoogleIcon />
              </div>
              {/* 登入文字 */}
              <span className="ml-6">
                {isLoading ? '登入中...' : '使用 Google 帳號登入'}
              </span>
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
