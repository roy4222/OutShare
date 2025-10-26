"use client";

import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

/**
 * 受保護路由專用的使用者 Context。
 *
 * 用於在 AuthGuard 中分享已驗證的 Supabase 使用者資訊，
 * 供子元件透過 useProtectedUser() 取得。
 */
const ProtectedUserContext = createContext<User | undefined>(undefined);

/**
 * 提供當前登入使用者的 Context Provider。
 */
export function ProtectedUserProvider({
  value,
  children,
}: {
  value: User;
  children: React.ReactNode;
}) {
  return (
    <ProtectedUserContext.Provider value={value}>
      {children}
    </ProtectedUserContext.Provider>
  );
}

/**
 * 取得已驗證的使用者。
 *
 * @throws 當 hook 在 AuthGuard 之外呼叫時拋出錯誤。
 */
export function useProtectedUser(): User {
  const user = useContext(ProtectedUserContext);

  if (!user) {
    throw new Error("useProtectedUser 必須在 AuthGuard 中使用");
  }

  return user;
}
