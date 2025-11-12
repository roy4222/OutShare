/**
 * useProfile Hook
 * 
 * 封裝個人資料邏輯（從 API 獲取，使用 Prisma Services）
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '@/lib/types/profile';
import type { ProfileData } from '@/lib/services/db';
import {
  faInstagram,
  faSquareFacebook,
  faThreads,
} from '@fortawesome/free-brands-svg-icons';

const DEFAULT_GEAR_DASHBOARD_TITLE = '我的裝備';

/**
 * 獲取當前使用者的個人資料
 * 
 * @returns 使用者個人資料
 * 
 * @example
 * const profile = useProfile();
 * console.log(profile.displayName);
 */
export function useProfile(): UserProfile {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const response = await fetch('/api/profiles');

        if (!isMounted) return;

        if (response.ok) {
          const { data } = await response.json();
          setProfileData(data);
        } else {
          // 如果沒有登入或沒有 profile，使用預設值
          console.log('No profile found, using default');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        // no-op
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const profile = useMemo<UserProfile>(() => {
    // 如果有從 API 獲取的資料，使用它
    if (profileData) {
      const socialLinks = [];
      const links = profileData.social_links || {};
      
      if (links.instagram) {
        socialLinks.push({
          href: links.instagram,
          icon: faInstagram,
          label: 'Instagram',
        });
      }
      if (links.facebook) {
        socialLinks.push({
          href: links.facebook,
          icon: faSquareFacebook,
          label: 'Facebook',
        });
      }
      if (links.threads) {
        socialLinks.push({
          href: links.threads,
          icon: faThreads,
          label: 'Threads',
        });
      }

      return {
        userId: profileData.user_id,
        username: profileData.username || 'user',
        displayName: profileData.display_name || profileData.username || 'User',
        avatar: profileData.avatar_url?.trim() || '',
        bio: profileData.bio || '',
        gearDashboardTitle:
          profileData.gear_dashboard_title || DEFAULT_GEAR_DASHBOARD_TITLE,
        socialLinks,
      };
    }

    // 預設資料（向後相容）
    return {
      userId: '00000000-0000-0000-0000-000000000000', // 預設 UUID
      username: 'kj',
      displayName: 'KJ',
      avatar: 'https://moegirl.uk/images/c/c1/Yanami_Anna_icon.png',
      bio: '新創產品經理・登山野營・單車野營・自助旅行',
      gearDashboardTitle: DEFAULT_GEAR_DASHBOARD_TITLE,
      socialLinks: [
        {
          href: 'https://www.instagram.com/kj.h.730/',
          icon: faInstagram,
          label: 'Instagram',
        },
        {
          href: 'https://www.facebook.com/kj790730',
          icon: faSquareFacebook,
          label: 'Facebook',
        },
        {
          href: 'https://www.threads.com/@kj.h.730',
          icon: faThreads,
          label: 'Threads',
        },
      ],
    };
  }, [profileData]);

  return profile;
}

/**
 * 根據使用者名稱獲取個人資料
 * 
 * @param username - 使用者名稱
 * @returns 使用者個人資料
 */
export function useProfileByUsername(username: string): {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/profiles/${encodeURIComponent(username)}`);

        if (!isMounted) return;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const { data } = await response.json();
        const profileData = data.profile;

        if (profileData) {
          const socialLinks = [];
          const links = profileData.social_links || {};
          
          if (links.instagram) {
            socialLinks.push({
              href: links.instagram,
              icon: faInstagram,
              label: 'Instagram',
            });
          }
          if (links.facebook) {
            socialLinks.push({
              href: links.facebook,
              icon: faSquareFacebook,
              label: 'Facebook',
            });
          }
          if (links.threads) {
            socialLinks.push({
              href: links.threads,
              icon: faThreads,
              label: 'Threads',
            });
          }

          setProfile({
            userId: profileData.user_id,
            username: profileData.username || 'user',
            displayName: profileData.display_name || profileData.username || 'User',
            avatar: profileData.avatar_url?.trim() || '',
            bio: profileData.bio || '',
            socialLinks,
          });
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (username) {
      fetchProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [username]);

  return { profile, isLoading, error };
}

