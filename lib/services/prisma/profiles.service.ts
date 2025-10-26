/**
 * Profiles Prisma Service
 * 
 * 處理使用者 Profile 相關的資料庫查詢操作（使用 Prisma ORM）
 * 
 * ⚠️ 重要提醒：
 * - Profile 的建立由 Supabase Auth Trigger 自動處理
 * - 使用者只能更新自己的 Profile
 * - Prisma 不會自動執行 RLS 政策，需在應用層檢查權限
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  mapProfile,
  type ProfilePayload,
  type ProfileRecord,
} from '@/lib/mappers/profile';

const DEFAULT_GEAR_DASHBOARD_TITLE = '我的裝備';

type SupabaseUserMetadata = {
  full_name?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  picture?: string | null;
  preferred_username?: string | null;
  [key: string]: unknown;
};

export type EnsureProfileParams = {
  userId: string;
  email?: string | null;
  metadata?: Record<string, unknown> | null;
};

/**
 * Profile 資料型別（Domain Model）
 */
export type ProfileData = ProfilePayload;

/**
 * 根據 user_id 獲取 Profile
 * 
 * @param userId - 使用者 ID (來自 Supabase Auth)
 * @returns Profile 資料
 */
export async function getProfileByUserId(
  userId: string
): Promise<{ data: ProfileData | null; error: Error | null }> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { user_id: userId },
    });

    return {
      data: profile ? mapProfile(profile as ProfileRecord) : null,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching profile by user ID:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 根據 username 獲取 Profile
 * 
 * @param username - 使用者名稱
 * @returns Profile 資料
 */
export async function getProfileByUsername(
  username: string
): Promise<{ data: ProfileData | null; error: Error | null }> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
    });

    return {
      data: profile ? mapProfile(profile as ProfileRecord) : null,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching profile by username:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 建立 Profile
 * 
 * ⚠️ 注意：通常由 Supabase Auth Trigger 自動建立，手動建立請謹慎使用
 * 
 * @param data - Profile 資料
 * @returns 新建立的 Profile
 */
export async function createProfile(
  data: {
    user_id: string;
    username?: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    social_links?: ProfileData['social_links'];
    gear_dashboard_title?: string;
  }
): Promise<{ data: ProfileData | null; error: Error | null }> {
  try {
    const profile = await prisma.profile.create({
      data: {
        user_id: data.user_id,
        username: data.username || null,
        display_name: data.display_name || null,
        bio: data.bio || null,
        avatar_url: data.avatar_url || null,
        social_links: data.social_links ?? {},
        gear_dashboard_title: data.gear_dashboard_title || null,
      },
    });

    return {
      data: mapProfile(profile as ProfileRecord),
      error: null,
    };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 更新 Profile
 * 
 * ⚠️ 權限檢查：只有擁有者可以更新
 * 
 * @param userId - 使用者 ID
 * @param data - 更新資料
 * @returns 更新後的 Profile
 */
export async function updateProfile(
  userId: string,
  data: {
    username?: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    social_links?: ProfileData['social_links'];
    gear_dashboard_title?: string;
  }
): Promise<{ data: ProfileData | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 執行更新
    const profile = await prisma.profile.update({
      where: { user_id: userId },
      data: {
        ...(data.username !== undefined && { username: data.username }),
        ...(data.display_name !== undefined && { display_name: data.display_name }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
        ...(data.social_links !== undefined && { social_links: data.social_links ?? {} }),
        ...(data.gear_dashboard_title !== undefined && { gear_dashboard_title: data.gear_dashboard_title }),
        updated_at: new Date(),
      },
    });

    return {
      data: mapProfile(profile as ProfileRecord),
      error: null,
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 確保 Supabase 使用者擁有對應的 Profile
 *
 * @param params - Supabase 使用者資訊
 * @returns Profile 資料（新建或原有）
 */
export async function ensureProfileForUser(
  params: EnsureProfileParams
): Promise<{ data: ProfileData | null; error: Error | null }> {
  try {
    const metadata = (params.metadata ?? {}) as SupabaseUserMetadata;
    const displayNameMetadata =
      metadata.full_name?.trim() ||
      metadata.name?.trim() ||
      metadata.preferred_username?.trim() ||
      params.email ||
      null;
    const rawAvatarUrl =
      typeof metadata.avatar_url === 'string'
        ? metadata.avatar_url
        : typeof metadata.picture === 'string'
          ? metadata.picture
          : null;
    const avatarUrlMetadata = rawAvatarUrl?.trim() || null;

    const existingProfile = await prisma.profile.findUnique({
      where: { user_id: params.userId },
    });

    if (!existingProfile) {
      const profile = await prisma.profile.create({
        data: {
          user_id: params.userId,
          display_name: displayNameMetadata,
          avatar_url: avatarUrlMetadata,
          social_links: {},
          gear_dashboard_title: DEFAULT_GEAR_DASHBOARD_TITLE,
        },
      });

      return {
        data: mapProfile(profile as ProfileRecord),
        error: null,
      };
    }

    const updateData: Prisma.ProfileUpdateInput = {};

    if (
      (!existingProfile.display_name ||
        existingProfile.display_name.trim().length === 0) &&
      displayNameMetadata
    ) {
      updateData.display_name = displayNameMetadata;
    }

    if (!existingProfile.avatar_url && avatarUrlMetadata) {
      updateData.avatar_url = avatarUrlMetadata;
    }

    if (
      existingProfile.social_links === null ||
      (typeof existingProfile.social_links === 'object' &&
        Object.keys(existingProfile.social_links as Record<string, unknown>)
          .length === 0)
    ) {
      updateData.social_links = {};
    }

    if (!existingProfile.gear_dashboard_title) {
      updateData.gear_dashboard_title = DEFAULT_GEAR_DASHBOARD_TITLE;
    }

    if (Object.keys(updateData).length === 0) {
      return {
        data: mapProfile(existingProfile as ProfileRecord),
        error: null,
      };
    }

    const updatedProfile = await prisma.profile.update({
      where: { user_id: params.userId },
      data: updateData,
    });

    return {
      data: mapProfile(updatedProfile as ProfileRecord),
      error: null,
    };
  } catch (error) {
    console.error('Error ensuring profile:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 檢查 username 是否可用
 * 
 * @param username - 要檢查的使用者名稱
 * @param excludeUserId - 排除的使用者 ID（用於更新時檢查）
 * @returns 是否可用
 */
export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string
): Promise<{ available: boolean; error: Error | null }> {
  try {
    const where: Prisma.ProfileWhereInput = { username };

    if (excludeUserId) {
      where.user_id = { not: excludeUserId };
    }

    const existingProfile = await prisma.profile.findFirst({
      where,
      select: { user_id: true },
    });

    return { available: !existingProfile, error: null };
  } catch (error) {
    console.error('Error checking username availability:', error);
    return { 
      available: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 獲取使用者的 Profile 及統計資料
 * 
 * @param userId - 使用者 ID
 * @returns Profile 及統計資料
 */
export async function getProfileWithStats(
  userId: string
): Promise<{ 
  data: { 
    profile: ProfileData | null; 
    stats: { tripCount: number; gearCount: number } 
  } | null; 
  error: Error | null 
}> {
  try {
    const [profile, tripCount, gearCount] = await Promise.all([
      prisma.profile.findUnique({
        where: { user_id: userId },
      }),
      prisma.trip.count({
        where: { user_id: userId },
      }),
      prisma.gear.count({
        where: { user_id: userId },
      }),
    ]);

    return { 
      data: {
        profile: profile ? mapProfile(profile as ProfileRecord) : null,
        stats: { tripCount, gearCount },
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching profile with stats:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
