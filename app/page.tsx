"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { GoogleIcon } from "@/asset/icons/GoogleIcon";
import SignUpLogo from "@/asset/logo/SignUpLogo";
import Logo from "@/asset/logo/Logo";

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <SignUpLogo />
          <div className="max-w-60 mx-auto">
            <Logo />
          </div>
          <motion.div
            className="text-base text-gray-500"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            開始記錄分享，你的戶外旅程與裝備吧！
          </motion.div>
        </div>

        <div>
          <Button
            className="w-full md:w-90 h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-800 border-2 border-radius-xl border-gray-200 hover:border-gray-300  transition-all duration-200 "
            variant="outline"
          >
            <GoogleIcon />
            使用 Google 帳號登入
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
