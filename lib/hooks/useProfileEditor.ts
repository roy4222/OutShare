"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SocialLinksFormState = {
  facebook: string;
  instagram: string;
  threads: string;
  youtube: string;
  x: string;
};

export type ProfileFormState = {
  displayName: string;
  avatarUrl: string;
  bio: string;
  socialLinks: SocialLinksFormState;
};

type ProfileApiResponse = {
  data?: {
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    social_links: Record<string, string | null> | null;
  };
  error?: string;
};

const DEFAULT_SOCIAL_LINKS: SocialLinksFormState = {
  facebook: "",
  instagram: "",
  threads: "",
  youtube: "",
  x: "",
};

const DEFAULT_AVATAR_URL = "/S__40583184_0.jpg";

export const createDefaultFormState = (): ProfileFormState => ({
  displayName: "",
  avatarUrl: DEFAULT_AVATAR_URL,
  bio: "",
  socialLinks: { ...DEFAULT_SOCIAL_LINKS },
});

export function useProfileEditor(userId: string | null | undefined) {
  const [formState, setFormState] = useState<ProfileFormState>(
    createDefaultFormState,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const applyProfileData = useCallback(
    (data: ProfileApiResponse["data"] | null) => {
      if (data) {
        const links = data.social_links ?? {};
        const avatarUrl =
          typeof data.avatar_url === "string" ? data.avatar_url.trim() : "";
        setFormState({
          displayName: data.display_name ?? "",
          avatarUrl: avatarUrl || DEFAULT_AVATAR_URL,
          bio: data.bio ?? "",
          socialLinks: {
            facebook: links.facebook ?? "",
            instagram: links.instagram ?? "",
            threads: links.threads ?? "",
            youtube: links.youtube ?? "",
            x: links.x ?? links.twitter ?? "",
          },
        });
        return;
      }

      setFormState(createDefaultFormState());
    },
    [],
  );

  const fetchProfile = useCallback(async () => {
    const response = await fetch("/api/profiles", {
      method: "GET",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      let errorPayload: ProfileApiResponse | null = null;
      try {
        errorPayload = await response.json();
      } catch {
        // 忽略解析錯誤
      }
      throw new Error(errorPayload?.error || "無法載入個人資料");
    }

    const { data }: ProfileApiResponse = await response.json();
    return data ?? null;
  }, []);

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setFormState(createDefaultFormState());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchProfile();
      applyProfileData(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      setErrorMessage("載入個人資料時發生錯誤，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  }, [applyProfileData, fetchProfile, userId]);

  useEffect(() => {
    let isActive = true;

    if (!userId) {
      setFormState(createDefaultFormState());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const run = async () => {
      try {
        const data = await fetchProfile();
        if (!isActive) {
          return;
        }
        applyProfileData(data);
      } catch (error) {
        console.error("Error loading profile:", error);
        if (isActive) {
          setErrorMessage("載入個人資料時發生錯誤，請稍後再試。");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [applyProfileData, fetchProfile, userId]);

  const handleDisplayNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormState((prev) => ({
        ...prev,
        displayName: value,
      }));
      setSuccessMessage(null);
      setErrorMessage(null);
    },
    [],
  );

  const handleBioChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setFormState((prev) => ({
        ...prev,
        bio: value,
      }));
      setSuccessMessage(null);
      setErrorMessage(null);
    },
    [],
  );

  const handleSocialLinkChange = useCallback(
    (key: keyof SocialLinksFormState) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormState((prev) => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [key]: value,
          },
        }));
        setSuccessMessage(null);
        setErrorMessage(null);
      },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setErrorMessage(null);
      setSuccessMessage(null);
      setIsSaving(true);

      try {
        const payload = {
          display_name: formState.displayName.trim() || null,
          avatar_url: formState.avatarUrl.trim() || null,
          bio: formState.bio.trim() || null,
          social_links: {
            facebook: formState.socialLinks.facebook.trim() || null,
            instagram: formState.socialLinks.instagram.trim() || null,
            threads: formState.socialLinks.threads.trim() || null,
            youtube: formState.socialLinks.youtube.trim() || null,
            x: formState.socialLinks.x.trim() || null,
          },
        };

        const response = await fetch("/api/profiles", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result: ProfileApiResponse = await response.json();

        if (!response.ok || result.error) {
          throw new Error(result.error || "儲存失敗，請稍後再試。");
        }

        applyProfileData(result.data ?? null);
        setSuccessMessage("個人資料已更新。");
      } catch (error) {
        console.error("Error saving profile:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "儲存失敗，請稍後再試。",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [applyProfileData, formState],
  );

  const resetState = useCallback(() => {
    setFormState(createDefaultFormState());
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return useMemo(
    () => ({
      formState,
      isLoading,
      isSaving,
      errorMessage,
      successMessage,
      handleDisplayNameChange,
      handleBioChange,
      handleSocialLinkChange,
      handleSubmit,
      reload: loadProfile,
      resetState,
    }),
    [
      formState,
      isLoading,
      isSaving,
      errorMessage,
      successMessage,
      handleDisplayNameChange,
      handleBioChange,
      handleSocialLinkChange,
      handleSubmit,
      loadProfile,
      resetState,
    ],
  );
}
