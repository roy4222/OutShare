/**
 * useProfile Hook
 * 
 * 封裝個人資料邏輯
 */

import { useMemo } from 'react';
import { UserProfile } from '@/lib/types/profile';
import {
  faInstagram,
  faSquareFacebook,
  faThreads,
} from '@fortawesome/free-brands-svg-icons';

/**
 * 獲取預設個人資料（目前使用硬編碼資料，未來可從資料庫獲取）
 * 
 * @returns 使用者個人資料
 * 
 * @example
 * const profile = useProfile();
 * console.log(profile.displayName); // 'KJ'
 */
export function useProfile(): UserProfile {
  const profile = useMemo<UserProfile>(() => {
    return {
      username: 'kj',
      displayName: 'KJ',
      avatar: '/S__40583184_0.jpg',
      bio: '新創產品經理・登山野營・單車野營・自助旅行',
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
  }, []);

  return profile;
}

/**
 * 根據使用者名稱獲取個人資料（預留介面，未來整合資料庫時使用）
 * 
 * @param _username - 使用者名稱（目前未使用）
 * @returns 使用者個人資料或 null
 */
export function useProfileByUsername(_username: string): UserProfile | null {
  // TODO: 未來從資料庫獲取
  // 目前返回預設資料
  return useProfile();
}

