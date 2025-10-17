/**
 * 使用者個人資料相關型別定義
 */

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * 社交媒體連結
 */
export interface SocialLink {
  href: string;
  icon: IconDefinition; // FontAwesome icon
  label: string;
}

/**
 * 使用者個人資料（Domain Model）
 */
export interface UserProfile {
  id?: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  socialLinks?: SocialLink[];
}

/**
 * ProfileHeader 組件 Props
 */
export interface ProfileHeaderProps {
  profile: UserProfile;
  className?: string;
}

/**
 * SocialLinks 組件 Props
 */
export interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

