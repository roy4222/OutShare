import type { ReactNode } from "react";
import AuthGuard from "./AuthGuard";

/**
 * 受保護路由群組的共用版面。
 *
 * 透過 AuthGuard 集中處理認證邏輯，確保所有子路由都已登入。
 */
export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}

