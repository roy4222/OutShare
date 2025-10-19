import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 圖片設定
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
