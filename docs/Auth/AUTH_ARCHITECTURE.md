# 🔐 認證架構說明

這份文件說明專案中的認證架構設計，以及如何正確地分離認證邏輯與 UI。

## 📋 目錄

- [架構概覽](#架構概覽)
- [使用方式](#使用方式)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

---

## 🏗️ 架構概覽

### 目前的架構層級

```
┌─────────────────────────────────────────┐
│         Middleware                      │  ← Session 更新
│    lib/supabase/middleware.ts           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Custom Hooks                    │  ← 認證邏輯層
│    lib/hooks/useAuth.ts                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Page Components                 │  ← UI 層
│    app/dashboard/page.tsx               │
└─────────────────────────────────────────┘
```

### 關注點分離

| 層級 | 職責 | 檔案位置 |
|------|------|---------|
| **Middleware** | Session 更新、Cookie 同步 | `middleware.ts` |
| **Hooks** | 認證邏輯、狀態管理 | `lib/hooks/useAuth.ts` |
| **Components** | UI 渲染、使用者互動 | `app/**/page.tsx` |
| **Services** | API 呼叫、資料處理 | `lib/supabase/client.ts` |

---

## 🚀 使用方式

### 在受保護的頁面使用

```tsx
// app/dashboard/page.tsx
"use client";

import { useRequireAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // 自動檢查登入狀態，未登入會重導向
  const { user, loading, signOut } = useRequireAuth();

  if (loading) {
    return <div>載入中...</div>;
  }

  // 不需要檢查 !user，因為 useRequireAuth 會自動重導向
  return (
    <div>
      <h1>歡迎，{user.email}</h1>
      <Button onClick={() => signOut()}>登出</Button>
    </div>
  );
}
```

### 在可選認證的頁面使用

```tsx
// app/profile/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export default function ProfilePage() {
  // 不強制登入，但可以獲取使用者狀態
  const { user, loading } = useAuth();

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <div>
      {user ? (
        <p>已登入：{user.email}</p>
      ) : (
        <p>訪客模式</p>
      )}
    </div>
  );
}
```

### 登入頁面（自動重導向已登入使用者）

```tsx
// app/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 如果已登入，重導向到 dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>檢查登入狀態...</div>;
  }

  return (
    <div>
      <button onClick={handleGoogleSignIn}>
        使用 Google 登入
      </button>
    </div>
  );
}
```

---

## ✅ 最佳實踐

### 1. 保持組件簡潔

❌ **不好的做法**：

```tsx
export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      {/* 100+ 行的 UI 程式碼 */}
    </div>
  );
}
```

✅ **好的做法**：

```tsx
export default function DashboardPage() {
  const { user, loading, signOut } = useRequireAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* 100+ 行的 UI 程式碼 */}
    </div>
  );
}
```

### 2. 適當的 Loading 狀態

```tsx
export default function DashboardPage() {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  // 這裡 user 一定存在（因為 useRequireAuth）
  return <Dashboard user={user} />;
}
```

### 3. 錯誤處理

```tsx
export default function DashboardPage() {
  const { user, loading, signOut } = useRequireAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      setError("登出失敗，請稍後再試");
      console.error(err);
    }
  };

  // ... UI
}
```

### 4. 重用性

將重複的認證邏輯抽取成組件：

```tsx
// components/auth/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

// 使用
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

---

## ❓ 常見問題

### Q1: 為什麼不直接在頁面中寫認證邏輯？

**A:** 
- ❌ 程式碼重複（每個受保護的頁面都要寫一次）
- ❌ 難以測試（邏輯和 UI 綁在一起）
- ❌ 難以維護（修改一個邏輯要改多個檔案）
- ✅ 使用 Hook 後：**一次編寫，到處使用**

### Q2: 如何處理 "登入後回到原頁面" 的需求？

**A:** 修改 `useAuth` Hook：

```typescript
export function useAuth(options: UseAuthOptions = {}) {
  // ... 原有程式碼

  const fetchUser = useCallback(async () => {
    const user = await supabase.auth.getUser();
    
    if (requireAuth && !user) {
      // 保存當前路徑
      const currentPath = window.location.pathname;
      router.push(`/?redirectTo=${encodeURIComponent(currentPath)}`);
    }
    
    return user;
  }, [requireAuth, router, supabase.auth]);

  // ...
}
```

登入成功後：

```typescript
// app/page.tsx
const handleGoogleSignIn = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
    },
  });
};
```

### Q3: 效能影響如何？

**A:** 

| 方案 | 首次載入時間 | 重導向時間 | 伺服器負載 |
|-----|------------|-----------|-----------|
| **無保護** | 最快 | - | 低 |
| **useAuth Hook** | 快（+50-100ms） | Client 端（快） | 低 |

**結論**：效能影響很小，這個方案適合大部分應用。

### Q4: Middleware 的作用是什麼？

**A:** 

目前的 middleware（`lib/supabase/middleware.ts`）只負責：
- ✅ 在每個請求時更新 session
- ✅ 確保 cookies 中的認證資料是最新的
- ✅ 避免 session 過期

**不負責**：
- ❌ 路由保護（由 `useAuth` hook 處理）
- ❌ 重導向（由頁面組件處理）

---

## 🔄 遷移指南

如果你有舊的頁面需要重構，follow 這些步驟：

### Step 1: 識別認證邏輯

找出頁面中所有與認證相關的程式碼：
- `useState` for user
- `useEffect` for checking auth
- `onAuthStateChange` listener
- `signOut` function

### Step 2: 替換成 Hook

```tsx
// Before
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
// ... 50 行認證邏輯

// After
const { user, loading, signOut } = useRequireAuth();
```

### Step 3: 清理程式碼

移除：
- 認證相關的 `useEffect`
- 手動的 subscription 清理
- 重複的錯誤處理

### Step 4: 測試

確認：
- ✅ 未登入時會重導向
- ✅ 登入後可以正常訪問
- ✅ 登出功能正常
- ✅ 頁面刷新後狀態保持

---

## 📚 相關檔案

- `lib/hooks/useAuth.ts` - 認證 Hook
- `lib/supabase/middleware.ts` - Session 更新 Middleware
- `middleware.ts` - Next.js Middleware 入口
- `app/dashboard/page.tsx` - 使用範例

---

## 🎯 決策樹

```
需要保護頁面？
├─ 是
│  └─ 使用 useRequireAuth() hook
└─ 否
   └─ 使用 useAuth() hook（不強制登入）
```

---

**最後更新**: 2025-10-18  
**維護者**: 開發團隊
