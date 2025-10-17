# Cloudflare Pages 靜態匯出部署指南

> ⚠️ **警告**：這不是推薦的方式！Cloudflare 官方建議使用 Workers 部署 Next.js。
> 
> 參考：[Cloudflare Pages Next.js Guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)

## 為什麼不推薦？

靜態匯出有以下限制：
- ❌ 無法使用 Middleware
- ❌ 無法使用 Server-side Rendering
- ❌ 無法使用 API Routes
- ❌ 無法使用動態路由（部分功能）
- ❌ 無法自動更新 Supabase session

## 配置步驟

### 1. 更新 next.config.ts

根據 [Cloudflare 官方文件](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)：

\`\`\`typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 啟用靜態匯出
  output: 'export',
  
  // 圖片優化（靜態匯出需要）
  images: {
    unoptimized: true,
  },
  
  // 可選：為每個路徑添加 trailing slash
  trailingSlash: true,
};

export default nextConfig;
\`\`\`

### 2. Cloudflare Pages 建置設定

在 Cloudflare Pages Dashboard：

**Framework preset:** Next.js (Static HTML Export)

| 配置選項 | 值 |
|---------|---|
| Production branch | main |
| Build command | npx next build |
| Build directory | out |

### 3. 處理認證（手動）

由於沒有 Middleware，需要在每個需要認證的頁面手動檢查：

\`\`\`typescript
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ProtectedPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
      }
      setLoading(false);
    };
    checkAuth();
  }, [router, supabase]);

  if (loading) return <div>載入中...</div>;

  return <div>受保護的內容</div>;
}
\`\`\`

### 4. OAuth Callback 處理

將 API Route 改為客戶端頁面：

**app/auth/callback/page.tsx：**

\`\`\`typescript
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => {
        router.push('/dashboard');
      });
    }
  }, [searchParams, router, supabase]);

  return <div>處理登入中...</div>;
}
\`\`\`

## 限制與問題

### 1. Session 不會自動更新

沒有 Middleware，Supabase session 不會自動刷新。需要手動處理：

\`\`\`typescript
// 在 layout.tsx 或主要組件
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
    // 強制刷新頁面以更新 session
    router.refresh();
  });

  return () => subscription.unsubscribe();
}, []);
\`\`\`

### 2. 效能較差

- 每個頁面都需要客戶端檢查認證
- 無法使用 Server-side Rendering
- 首次載入較慢

### 3. SEO 不佳

靜態匯出的動態內容對 SEO 不友好。

## 建議的替代方案

### 選項 A：使用 Cloudflare Workers（推薦）✅

安裝 `@cloudflare/next-on-pages`：

\`\`\`bash
npm install --save-dev @cloudflare/next-on-pages
\`\`\`

更新 `package.json`：

\`\`\`json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages",
    "pages:dev": "npx @cloudflare/next-on-pages --watch"
  }
}
\`\`\`

在 Cloudflare Pages 設定：

| 配置選項 | 值 |
|---------|---|
| Build command | npm run pages:build |
| Build directory | .vercel/output/static |

**優點：**
- ✅ 支援 Middleware
- ✅ 支援 API Routes  
- ✅ 支援 SSR
- ✅ 完整的 Next.js 功能

### 選項 B：遷移到 Vercel（最簡單）✅

1. 前往 [vercel.com](https://vercel.com)
2. Import GitHub repository
3. 自動部署

**優點：**
- ✅ 零配置
- ✅ 完整 Next.js 支援
- ✅ 免費方案
- ✅ 自動 HTTPS

## 總結

| 方案 | Middleware | API Routes | SSR | 難度 | 推薦度 |
|------|-----------|-----------|-----|------|-------|
| Cloudflare Workers | ✅ | ✅ | ✅ | 中 | ⭐⭐⭐⭐⭐ |
| Vercel | ✅ | ✅ | ✅ | 易 | ⭐⭐⭐⭐⭐ |
| 靜態匯出 | ❌ | ❌ | ❌ | 易 | ⭐ |

## 參考資源

- [Cloudflare Next.js Guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)

