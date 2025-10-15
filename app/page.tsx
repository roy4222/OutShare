"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { GoogleIcon } from "@/asset/icons/GoogleIcon";
import SignUpLogo from "@/asset/logo/SignUpLogo";
import OutshareLogo from "@/asset/logo/OutshareLogo";
import BetaLogo from "@/asset/logo/BetaLogo";

export function HomePage() {
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
            className="w-full h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-800 border-2 rounded-3xl border-gray-200 hover:border-gray-300  transition-all duration-200 "
            variant="outline"
          >
            <span className="text-base font-medium flex items-center justify-start p-4 w-full">
              {/* Google 圖標 */}
              <div className="flex-shrink-0">
                <GoogleIcon />
              </div>
              {/* 登入文字 */}
              <span className="ml-6">使用 Google 帳號登入</span>
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;
