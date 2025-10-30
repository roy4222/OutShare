"use client";

import Navbar from "@/components/features/layout/Navbar";
import SideBar from "@/components/features/layout/SideBar";
import { ProfileEditForm } from "@/components/features/profile";
import { useProfileEditor } from "@/lib/hooks/useProfileEditor";
import { useProtectedUser } from "@/lib/hooks/useProtectedUser";

export default function ProfileEditPage() {
  const user = useProtectedUser();
  const {
    formState,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    handleDisplayNameChange,
    handleBioChange,
    handleSocialLinkChange,
    handleSubmit,
  } = useProfileEditor(user.id);

  const email = user.email ?? "";
  const avatarFallback = user.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex pt-16">
        <SideBar />
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-10">
              <h1 className="text-xl font-bold text-gray-900">個人檔案</h1>
            </header>
            <div className="mx-auto max-w-md">
              <ProfileEditForm
                email={email}
                avatarFallback={avatarFallback}
                formState={formState}
                isLoading={isLoading}
                isSaving={isSaving}
                errorMessage={errorMessage}
                successMessage={successMessage}
                onDisplayNameChange={handleDisplayNameChange}
                onBioChange={handleBioChange}
                onSocialLinkChange={handleSocialLinkChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

 