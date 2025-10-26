"use client";

import { useRequireAuth } from "@/lib/hooks/useAuth";
import { ProtectedUserProvider } from "@/lib/hooks/useProtectedUser";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-lg text-gray-600">載入中...</span>
      </div>
    );
  }

  if (!user) {
    return null; // useRequireAuth 會自動重導向至首頁
  }

  return (
    <ProtectedUserProvider value={user}>
      {children}
    </ProtectedUserProvider>
  );
}

