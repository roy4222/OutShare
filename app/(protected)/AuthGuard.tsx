"use client";

import { useRequireAuth } from "@/lib/hooks/useAuth";
import { ProtectedUserProvider } from "@/lib/hooks/useProtectedUser";

import { LoadingLogo } from "@/components/ui/loading/LoadingLogo";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <LoadingLogo text="驗證身分中..." />
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

