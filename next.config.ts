import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'export' 以支援 Middleware 和 API Routes
  // 如果需要靜態匯出，可以使用 Vercel、Netlify 等平台部署
  
  // 圖片設定
  images: {
    unoptimized: true,
  },

  // Webpack 設定：修復 Supabase 在 Cloudflare Workers 的打包問題
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 確保 Supabase 相關套件被正確打包
      config.externals = config.externals || [];
      
      // 不要將這些套件標記為 external
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter((external: any) => {
          if (typeof external === 'string') {
            return !external.includes('@supabase');
          }
          return true;
        });
      }
    }
    
    return config;
  },

  // Server 端外部套件設定：讓這些套件由 Node.js runtime 處理而非打包進 bundle
  serverExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
