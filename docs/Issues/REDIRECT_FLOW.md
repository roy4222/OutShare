# 🔄 登入後重導向流程說明

## 📍 當前重導向邏輯

### Google 登入成功後的流程

```
使用者點擊「使用 Google 帳號登入」
    ↓
重導向到 Google 授權頁面
    ↓
使用者完成授權
    ↓
Google 重導向回 /auth/callback?code=xxx
    ↓
Exchange code for session
    ↓
✅ 登入成功，重導向到 /profile (個人資料頁面)
```

## 🎯 重要的重導向點

### 1. OAuth Callback 預設重導向

**檔案**: `app/auth/callback/route.ts`

```typescript
// 登入成功後的預設目標頁面
const next = searchParams.get('next') ?? '/profile'
```

**說明**:
- ✅ **預設**: 登入成功後跳轉到 `/profile`
- ✅ **自訂**: 可透過 URL 參數 `next` 指定其他頁面

### 2. 首頁自動跳轉

**檔案**: `app/page.tsx`

```typescript
useEffect(() => {
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.push("/profile");  // 已登入使用者自動跳轉到 profile
    }
  };
  checkUser();
}, []);
```

**說明**:
- ✅ 如果使用者已登入，訪問首頁 `/` 會自動跳轉到 `/profile`
- ✅ 如果使用者未登入，停留在首頁顯示登入按鈕

### 3. Dashboard 頁面保護

**檔案**: `app/dashboard/page.tsx`

```typescript
useEffect(() => {
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");  // 未登入使用者跳回首頁
    }
  };
  checkUser();
}, []);
```

**說明**:
- ✅ 未登入使用者訪問 `/dashboard` 會被重導向回首頁 `/`

---

## 🔀 完整的使用者流程

### 情境 1: 新使用者首次登入

```
1. 使用者訪問 / (首頁)
   → 顯示登入頁面

2. 點擊「使用 Google 帳號登入」
   → 重導向到 Google

3. Google 授權完成
   → 重導向到 /auth/callback

4. Session 建立成功
   → 重導向到 /profile ✅

5. 使用者看到個人資料頁面
```

### 情境 2: 已登入使用者訪問首頁

```
1. 使用者訪問 / (首頁)
   → 檢測到已登入

2. 自動跳轉
   → 重導向到 /profile ✅

3. 使用者看到個人資料頁面
```

### 情境 3: 未登入使用者訪問受保護頁面

```
1. 使用者訪問 /dashboard
   → 檢測到未登入

2. 自動跳轉
   → 重導向到 / (首頁)

3. 顯示登入按鈕
```

### 情境 4: 使用者登出

```
1. 使用者在 /profile 或 /dashboard 點擊「登出」
   → 清除 session

2. 自動跳轉
   → 重導向到 / (首頁)

3. 顯示登入按鈕
```

---

## 🛠 如何自訂重導向目標

### 方法 1: 修改預設重導向位置

編輯 `app/auth/callback/route.ts`:

```typescript
// 將預設重導向改為其他頁面
const next = searchParams.get('next') ?? '/dashboard'  // 改成 dashboard
```

### 方法 2: 使用 URL 參數動態指定

在登入時傳入 `next` 參數:

```typescript
// 在 app/page.tsx 的 handleGoogleSignIn
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback?next=/custom-page`,
  },
});
```

這樣登入後會跳轉到 `/custom-page`

### 方法 3: 根據使用者類型條件式重導向

編輯 `app/auth/callback/route.ts`，添加更複雜的邏輯:

```typescript
if (!error) {
  // 取得使用者資訊
  const { data: { user } } = await supabase.auth.getUser();
  
  // 根據使用者資訊決定跳轉位置
  let redirectPath = '/profile';  // 預設
  
  if (user?.user_metadata?.is_new_user) {
    redirectPath = '/onboarding';  // 新使用者跳轉到引導頁
  } else if (user?.user_metadata?.role === 'admin') {
    redirectPath = '/admin/dashboard';  // 管理員跳轉到管理後台
  }
  
  return NextResponse.redirect(`${origin}${redirectPath}`);
}
```

---

## 📊 重導向對照表

| 起始頁面 | 使用者狀態 | 目標頁面 | 原因 |
|---------|----------|---------|------|
| `/` | 未登入 | `/` (停留) | 顯示登入按鈕 |
| `/` | 已登入 | `/profile` | 已登入自動跳轉 |
| Google OAuth | 登入成功 | `/profile` | 預設重導向 |
| `/dashboard` | 未登入 | `/` | 受保護頁面 |
| `/dashboard` | 已登入 | `/dashboard` (停留) | 允許訪問 |
| `/profile` | 未登入 | 需要加保護* | 視需求而定 |
| `/profile` | 已登入 | `/profile` (停留) | 顯示個人資料 |

\* 註: 目前 `/profile` 頁面沒有登入保護，如果需要可以加上。

---

## 🔒 為 Profile 頁面添加登入保護 (選用)

如果你希望 `/profile` 也需要登入才能訪問，可以這樣修改:

### 編輯 `app/profile/page.tsx`

在檔案開頭加入:

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // 檢查登入狀態
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/");  // 未登入跳回首頁
        return;
      }
      
      setLoading(false);
    };
    
    checkUser();
  }, [router, supabase.auth]);

  if (loading) {
    return <div>載入中...</div>;
  }

  // ... 原本的頁面內容
}
```

---

## 🎯 建議的頁面結構

```
/ (首頁)
├─ 未登入: 顯示登入頁面
└─ 已登入: 自動跳轉到 /profile

/profile (個人資料頁)
├─ 未登入: 可選擇是否保護
└─ 已登入: 顯示使用者的個人資料和旅程記錄

/dashboard (管理後台 - 示範頁面)
├─ 未登入: 跳轉到首頁
└─ 已登入: 顯示使用者資訊和管理功能

/auth/callback (OAuth 回調)
└─ 處理 Google 登入，完成後跳轉到 /profile
```

---

## ✅ 測試檢查清單

登入流程測試:

- [ ] 訪問首頁 `/` 顯示登入按鈕
- [ ] 點擊登入按鈕跳轉到 Google
- [ ] Google 授權後自動跳轉回 `/profile`
- [ ] 在 `/profile` 看到使用者資料
- [ ] 已登入狀態下訪問 `/` 自動跳轉到 `/profile`
- [ ] 點擊登出後跳轉到 `/`
- [ ] 未登入狀態訪問 `/dashboard` 跳轉到 `/`

---

## 📝 總結

當前的重導向邏輯:

✅ **登入成功** → `/profile`  
✅ **已登入訪問首頁** → `/profile`  
✅ **未登入訪問受保護頁面** → `/`  
✅ **登出** → `/`

這個設計確保使用者體驗流暢，登入後直接看到個人資料頁面，登出後回到登入頁面。

