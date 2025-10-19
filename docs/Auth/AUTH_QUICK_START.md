# 🚀 認證系統快速開始指南

這是一份快速參考指南，幫助你在專案中正確使用認證系統。

## 📚 基本用法

### 1. 受保護的頁面（必須登入）

```tsx
"use client";

import { useRequireAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // ✅ 一行搞定！自動檢查登入、自動重導向
  const { user, loading, signOut } = useRequireAuth();

  if (loading) {
    return <div>載入中...</div>;
  }

  // 這裡 user 一定存在
  return (
    <div>
      <h1>歡迎，{user.email}</h1>
      <Button onClick={() => signOut()}>登出</Button>
    </div>
  );
}
```

### 2. 可選登入的頁面（訪客也能看）

```tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export default function PublicPage() {
  // ✅ 不強制登入，但可以取得使用者狀態
  const { user, loading } = useAuth();

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <div>
      {user ? (
        <p>歡迎回來，{user.email}</p>
      ) : (
        <p>你好，訪客！</p>
      )}
    </div>
  );
}
```

### 3. 登入頁面

```tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // ✅ 已登入的使用者自動重導向到 dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('登入錯誤:', error.message);
        alert('登入失敗');
      }
    } catch (error) {
      console.error('未預期的錯誤:', error);
      alert('登入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>檢查登入狀態...</div>;
  }

  return (
    <div>
      <button onClick={handleGoogleSignIn} disabled={isLoading}>
        {isLoading ? '登入中...' : '使用 Google 登入'}
      </button>
    </div>
  );
}
```

---

## 🎯 常見場景

### 場景 1：在組件中使用使用者資料

```tsx
function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return <div>請先登入</div>;
  }

  return (
    <div>
      <img src={user.user_metadata?.avatar_url} />
      <p>{user.user_metadata?.full_name}</p>
      <p>{user.email}</p>
    </div>
  );
}
```

### 場景 2：登出按鈕

```tsx
function LogoutButton() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      // 會自動重導向
    } catch (error) {
      alert('登出失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? '登出中...' : '登出'}
    </button>
  );
}
```

### 場景 3：根據登入狀態顯示不同內容

```tsx
function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return <nav>載入中...</nav>;
  }

  return (
    <nav>
      {user ? (
        <>
          <Link href="/dashboard">控制台</Link>
          <Link href="/profile">個人資料</Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/">登入</Link>
          <Link href="/about">關於我們</Link>
        </>
      )}
    </nav>
  );
}
```

### 場景 4：條件式渲染

```tsx
function PremiumFeature() {
  const { user } = useRequireAuth();

  // 檢查使用者權限
  const isPremium = user.user_metadata?.subscription === 'premium';

  if (!isPremium) {
    return <div>此功能僅限進階會員</div>;
  }

  return <div>進階功能內容</div>;
}
```

---

## 📋 Checklist：我該用哪個？

### 使用 `useRequireAuth()`

- ✅ 整個頁面都需要登入才能看
- ✅ 未登入使用者應該被重導向
- ✅ 不需要考慮未登入的狀態

**範例頁面**：
- `/dashboard` - 控制台
- `/profile/edit` - 個人資料編輯
- `/settings` - 設定頁面
- `/admin` - 管理後台

### 使用 `useAuth()`

- ✅ 頁面有部分內容訪客也能看
- ✅ 需要根據登入狀態顯示不同內容
- ✅ 登入頁面（避免已登入使用者看到）

**範例頁面**：
- `/` - 首頁（已登入自動跳轉）
- `/products` - 商品列表（登入可以看更多）
- `/blog` - 部落格（登入可以留言）

---

## ⚠️ 常見錯誤

### ❌ 錯誤 1：在組件中重複檢查登入

```tsx
// ❌ 不好
function Dashboard() {
  const { user } = useRequireAuth(); // 已經檢查過了
  
  if (!user) {  // ← 多餘的檢查
    router.push("/");
    return null;
  }
  
  return <div>Dashboard</div>;
}

// ✅ 好
function Dashboard() {
  const { user, loading } = useRequireAuth();
  
  if (loading) return <div>載入中...</div>;
  
  // user 一定存在，不需要再檢查
  return <div>歡迎，{user.email}</div>;
}
```

### ❌ 錯誤 2：忘記處理 loading 狀態

```tsx
// ❌ 不好
function Dashboard() {
  const { user } = useRequireAuth();
  
  // 在 loading 時 user 是 null，會閃爍
  return <div>{user.email}</div>;  // ← 可能報錯
}

// ✅ 好
function Dashboard() {
  const { user, loading } = useRequireAuth();
  
  if (loading) {
    return <div>載入中...</div>;
  }
  
  return <div>{user.email}</div>;
}
```

### ❌ 錯誤 3：在錯誤的地方使用 `useRequireAuth`

```tsx
// ❌ 不好 - 在登入頁使用 useRequireAuth
function LoginPage() {
  const { user } = useRequireAuth();  // ← 會造成無限重導向
  
  return <div>登入頁面</div>;
}

// ✅ 好 - 使用 useAuth
function LoginPage() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);
  
  return <div>登入頁面</div>;
}
```

---

## 🔍 除錯技巧

### 查看當前使用者狀態

在任何組件中：

```tsx
function DebugAuth() {
  const { user, loading } = useAuth();
  
  return (
    <pre>
      {JSON.stringify({ user, loading }, null, 2)}
    </pre>
  );
}
```

### 在瀏覽器 Console 查看

```javascript
// 查看 session
const { createClient } = await import('./lib/supabase/client')
const supabase = createClient()
const { data } = await supabase.auth.getSession()
console.log(data)
```

---

## 📖 進階閱讀

- [完整架構說明](./AUTH_ARCHITECTURE.md)
- [Google OAuth 設定](../Issues/README_GOOGLE_AUTH.md)

---

**最後更新**: 2025-10-18
