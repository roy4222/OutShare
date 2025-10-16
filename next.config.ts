import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'export' 以支援 Middleware 和 API Routes
  // 如果需要靜態匯出，可以使用 Vercel、Netlify 等平台部署
  
  // 圖片設定
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
