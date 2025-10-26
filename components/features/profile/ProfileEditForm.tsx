"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  ProfileFormState,
  SocialLinksFormState,
} from "@/lib/hooks/useProfileEditor";
import type {
  ChangeEvent,
  FormEvent,
} from "react";

export type ProfileEditFormProps = {
  email: string;
  avatarFallback: string;
  formState: ProfileFormState;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onDisplayNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBioChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSocialLinkChange: (
    key: keyof SocialLinksFormState,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function ProfileEditForm({
  email,
  avatarFallback,
  formState,
  isLoading,
  isSaving,
  errorMessage,
  successMessage,
  onDisplayNameChange,
  onBioChange,
  onSocialLinkChange,
  onSubmit,
}: ProfileEditFormProps) {
  const isFormDisabled = isLoading || isSaving;

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      <section className="flex flex-col items-center gap-4">
        <Avatar className="size-28 border border-slate-200 bg-white shadow-sm">
          <AvatarImage
            src={formState.avatarUrl}
            alt="使用者頭像"
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-sm font-semibold text-gray-600">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-md border-2 border-green-700 px-2 text-sm font-bold text-green-700 shadow-sm transition-colors hover:bg-green-700 hover:text-white"
          disabled={isFormDisabled}
        >
          更換圖片
        </Button>
      </section>

      <section className="space-y-6">
        {(errorMessage || successMessage) && (
          <div className="space-y-2">
            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600" role="status">
                {successMessage}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="displayName"
            className="text-sm font-medium text-gray-900"
          >
            暱稱
          </Label>
          <Input
            id="displayName"
            value={formState.displayName}
            placeholder="請輸入暱稱"
            className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:ring-[1px] focus-visible:border-green-700 focus-visible:ring-green-700"
            onChange={onDisplayNameChange}
            disabled={isFormDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-900"
          >
            電子郵件
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            readOnly
            className="h-12 cursor-default rounded-xl border border-slate-200 bg-gray-100 text-base text-gray-600 shadow-sm focus-visible:ring-[1px] focus-visible:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-none"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="bio"
            className="text-sm font-medium text-gray-900"
          >
            介紹
          </Label>
          <textarea
            id="bio"
            maxLength={150}
            value={formState.bio}
            placeholder="請輸入自我介紹"
            className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-gray-900 placeholder:text-muted-foreground shadow-sm focus-visible:ring-[1px] focus-visible:border-green-700 focus-visible:outline-none focus-visible:ring-green-700"
            onChange={onBioChange}
            disabled={isFormDisabled}
          />
          <p className="text-xs text-muted-foreground">最多 150 字</p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="facebook"
            className="text-sm font-medium text-gray-900"
          >
            Facebook 連結
          </Label>
          <Input
            id="facebook"
            value={formState.socialLinks.facebook}
            placeholder="請輸入連結 https://..."
            className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:ring-[1px] focus-visible:border-green-700 focus-visible:ring-green-700"
            onChange={onSocialLinkChange("facebook")}
            disabled={isFormDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="instagram"
            className="text-sm font-medium text-gray-900"
          >
            Instagram 連結
          </Label>
          <Input
            id="instagram"
            value={formState.socialLinks.instagram}
            placeholder="請輸入連結 https://..."
            className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:ring-[1px] focus-visible:border-green-700 focus-visible:ring-green-700"
            onChange={onSocialLinkChange("instagram")}
            disabled={isFormDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="threads"
            className="text-sm font-medium text-gray-900"
          >
            Threads 連結
          </Label>
          <Input
            id="threads"
            value={formState.socialLinks.threads}
            placeholder="請輸入連結 https://..."
            className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:ring-[1px] focus-visible:border-green-700 focus-visible:ring-green-700"
            onChange={onSocialLinkChange("threads")}
            disabled={isFormDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="youtube"
            className="text-sm font-medium text-gray-900"
          >
            Youtube 連結
          </Label>
          <Input
            id="youtube"
            value={formState.socialLinks.youtube}
            placeholder="請輸入連結 https://..."
            className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:ring-[1px] focus-visible:border-green-700 focus-visible:ring-green-700"
            onChange={onSocialLinkChange("youtube")}
            disabled={isFormDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="x"
            className="text-sm font-medium text-gray-900"
          >
            X 連結
          </Label>
          <Input
            id="x"
            value={formState.socialLinks.x}
            placeholder="請輸入連結 https://..."
            className="h-12 rounded-xl border border-slate-200 bg-white text-base shadow-sm focus-visible:ring-[1px] focus-visible:border-green-700 focus-visible:ring-green-700"
            onChange={onSocialLinkChange("x")}
            disabled={isFormDisabled}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-11 rounded-xl bg-green-700 px-6 text-base font-semibold text-white shadow-sm hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isFormDisabled}
          >
            {isSaving ? "儲存中..." : "儲存變更"}
          </Button>
        </div>
      </section>
    </form>
  );
}
