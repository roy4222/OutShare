import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

   // 加上這一段來關閉圖片優化
   images: {
    unoptimized: true,
  },
};

export default nextConfig;
