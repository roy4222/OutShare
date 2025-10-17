# Google 登入功能說明

## 📦 已建立的檔案

本次實作已建立以下檔案來支援 Google OAuth 登入功能:

### 核心檔案

```
lib/supabase/
├── client.ts           # 客戶端 Supabase 實例 (已存在，已更新)
├── server.ts           # 伺服器端 Supabase 實例 (新增)
└── middleware.ts       # Middleware 用 Supabase 實例 (新增)

middleware.ts           # Next.js Middleware，更新 session (新增)

app/
├── page.tsx            # 首頁，包含 Google 登入按鈕 (已更新)
├── auth/
│   ├── callback/
│   │   └── route.ts    # OAuth callback 處理 (新增)
│   └── auth-code-error/
│       └── page.tsx    # 錯誤頁面 (新增)
└── dashboard/
    └── page.tsx        # 受保護的頁面範例 (新增)

components/
└── AuthButton.tsx      # 認證按鈕組件 (新增)
```

### 文件

```
SETUP_GOOGLE_AUTH.md    # 完整設定指南 (新增)
README_GOOGLE_AUTH.md   # 本檔案 (新增)
```

---

## 🔧 快速開始

### 1. 安裝依賴 (如果尚未安裝)

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. 設定環境變數

建立 `.env.local` 檔案:

```env
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth 設定
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**獲取方式**:
- Supabase 憑證: [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API
- Google Client ID: 參考 `SETUP_GOOGLE_AUTH.md` 完整設定流程

### 3. 設定 Google Cloud & Supabase

詳細步驟請參考 **[SETUP_GOOGLE_AUTH.md](./SETUP_GOOGLE_AUTH.md)**

### 4. 啟動開發伺服器

```bash
npm run dev
```

### 5. 測試登入

1. 開啟 `http://localhost:3000`
2. 點擊「使用 Google 帳號登入」
3. 登入成功後，前往 `http://localhost:3000/dashboard` 查看使用者資訊

---

## 📖 主要功能說明

### 1️⃣ 客戶端登入 (`app/page.tsx`)

在首頁點擊按鈕觸發 Google OAuth 流程:

```typescript
const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
```

**流程**:
1. 使用者點擊「使用 Google 帳號登入」
2. 重導向至 Google 登入頁面
3. 使用者授權後，Google 重導向回 `/auth/callback`

### 2️⃣ OAuth Callback 處理 (`app/auth/callback/route.ts`)

處理 Google 返回的授權碼:

```typescript
export async function GET(request: NextRequest) {
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}/`)
    }
  }
  
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```

**流程**:
1. 接收 OAuth `code` 參數
2. 使用 `exchangeCodeForSession` 將 code 換成 session
3. Session 會自動儲存在 cookies 中
4. 重導向使用者到首頁或原本想訪問的頁面

### 3️⃣ Session 管理 (`middleware.ts`)

自動更新使用者的 session:

```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

**作用**:
- 在每個請求前更新 session
- 確保使用者的認證狀態保持最新
- 自動處理 token refresh

### 4️⃣ 受保護的頁面 (`app/dashboard/page.tsx`)

示範如何建立需要登入才能訪問的頁面:

```typescript
useEffect(() => {
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/");  // 未登入，重導向到首頁
      return;
    }
    
    setUser(user);
  };
  
  checkUser();
}, []);
```

**功能**:
- ✅ 檢查使用者登入狀態
- ✅ 顯示使用者資訊 (名稱、Email、頭像等)
- ✅ 提供登出功能
- ✅ 監聽認證狀態變化

### 5️⃣ 認證按鈕組件 (`components/AuthButton.tsx`)

可重複使用的認證狀態顯示組件:

```typescript
export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  
  // 自動監聽認證狀態
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // 根據登入狀態顯示不同內容
  return user ? <SignedInView /> : <SignInButton />;
}
```

**用途**:
- 在 Header 或 Navigation 中顯示登入狀態
- 根據狀態自動切換顯示內容

---

## 🔐 安全性說明

### Row Level Security (RLS)

Supabase 使用 RLS 保護資料安全，確保:
- ✅ 使用者只能存取自己的資料
- ✅ 未登入的使用者無法存取受保護的資料
- ✅ 所有資料存取都經過 JWT 驗證

### Token 管理

- **Access Token**: 短期有效 (預設 1 小時)，用於 API 請求認證
- **Refresh Token**: 長期有效 (預設 30 天)，用於自動更新 access token
- Tokens 儲存在 httpOnly cookies 中，防止 XSS 攻擊

### PKCE Flow

本實作使用 PKCE (Proof Key for Code Exchange) 流程:
1. 更安全的 OAuth 流程
2. 防止授權碼攔截攻擊
3. 適合 SPA 和 Mobile 應用

---

## 🎯 使用範例

### 在 Client Component 中取得使用者資訊

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MyComponent() {
  const [user, setUser] = useState(null);
  const supabase = createClient();
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);
  
  return <div>Hello, {user?.email}</div>;
}
```

### 在 Server Component 中取得使用者資訊

```typescript
import { createClient } from "@/lib/supabase/server";

export default async function MyServerComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <div>Hello, {user?.email}</div>;
}
```

### 登出功能

```typescript
const handleSignOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  router.push("/");
};
```

### 監聽認證狀態變化

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('使用者已登入');
      }
      if (event === 'SIGNED_OUT') {
        console.log('使用者已登出');
      }
    }
  );
  
  return () => subscription.unsubscribe();
}, []);
```

---

## 📊 資料庫整合

### 自動建立 User Profile

當使用者首次登入時,可以使用 Supabase Database Trigger 自動建立 profile:

```sql
-- 在 Supabase SQL Editor 中執行

-- 建立 profiles 表 (如果尚未建立)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 啟用 RLS
alter table public.profiles enable row level security;

-- Policy: 使用者可以查看自己的 profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Policy: 使用者可以更新自己的 profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Function: 自動建立 profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger: 當新使用者註冊時自動建立 profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 查詢使用者資料

```typescript
// 取得當前使用者的 profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// 更新 profile
const { error } = await supabase
  .from('profiles')
  .update({ bio: 'New bio' })
  .eq('id', user.id);
```

---

## 🚀 進階功能

### 自訂登入後重導向

```typescript
// 儲存使用者原本想訪問的頁面
const handleGoogleSignIn = async () => {
  const returnTo = window.location.pathname;
  
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${returnTo}`,
    },
  });
};
```

### 取得 Google Access Token

如果需要呼叫 Google API (如 Google Drive、Calendar):

```typescript
const { data: { session } } = await supabase.auth.getSession();
const googleAccessToken = session?.provider_token;

// 使用 Google API
const response = await fetch('https://www.googleapis.com/drive/v3/files', {
  headers: {
    Authorization: `Bearer ${googleAccessToken}`,
  },
});
```

### 路由保護 Middleware

```typescript
// middleware.ts

export async function middleware(request: NextRequest) {
  const res = await updateSession(request);
  
  // 保護特定路由
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const supabase = createServerClient(/* ... */);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return res;
}
```

---

## 🐛 除錯技巧

### 查看 Session 資訊

在瀏覽器 Console 執行:

```javascript
const { createClient } = await import('./lib/supabase/client')
const supabase = createClient()

// 查看當前 session
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// 查看當前使用者
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

### 查看 Supabase Logs

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇專案
3. 左側選單 → Logs → Auth Logs
4. 查看登入請求和錯誤

### 常見錯誤訊息

| 錯誤 | 原因 | 解決方法 |
|------|------|----------|
| `redirect_uri_mismatch` | Redirect URI 設定不符 | 檢查 Google Console 和 Supabase 的 redirect URLs |
| `invalid_client` | Client ID 或 Secret 錯誤 | 重新檢查 Supabase Dashboard 的設定 |
| `User not found` | Session 過期或無效 | 清除 cookies 並重新登入 |

---

## 📚 相關資源

- [Supabase Auth 官方文檔](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 文檔](https://developers.google.com/identity/protocols/oauth2)
- [Next.js SSR with Supabase](https://supabase.com/docs/guides/auth/server-side)
- [完整設定指南](./SETUP_GOOGLE_AUTH.md)

---

## ✅ 檢查清單

實作完成後,確認以下項目:

- [ ] Google Cloud Console 已設定 OAuth 客戶端
- [ ] Supabase Dashboard 已啟用 Google Provider
- [ ] 環境變數已正確設定
- [ ] 可以成功點擊登入按鈕
- [ ] 可以重導向到 Google 登入頁面
- [ ] 登入後可以回到應用程式
- [ ] 可以在 `/dashboard` 查看使用者資訊
- [ ] 可以成功登出

---

**🎉 恭喜！你已經成功實作 Google 登入功能！**

