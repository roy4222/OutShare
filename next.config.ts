import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 圖片設定
  images: {
    unoptimized: true,
  },
};

if (process.env.NODE_ENV === "development") {
  // 僅在本機開發啟用 Cloudflare dev，避免 Vercel build 觸發 workerd glibc 需求
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  if (typeof initOpenNextCloudflareForDev === "function") {
    initOpenNextCloudflareForDev();
  }
}

export default nextConfig;
