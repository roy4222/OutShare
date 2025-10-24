/**
 * Trips Prisma Service
 * 
 * 處理旅程相關的資料庫查詢操作（使用 Prisma ORM）
 * 
 * ⚠️ 重要提醒：
 * - 所有寫入操作（create, update, delete）必須驗證 userId
 * - Prisma 不會自動執行 RLS 政策，需在應用層檢查權限
 */

import { prisma } from '@/lib/prisma';
import { Trip } from '@/lib/types/trip';
import { Equipment } from '@/lib/types/equipment';
import { Prisma } from '@prisma/client';
import {
  mapTrip,
  mapTripList,
  mapTripWithEquipment,
  type TripRecord,
  type TripWithGear,
} from '@/lib/mappers/trip';

/**
 * 獲取旅程列表
 * 
 * @param options - 查詢選項
 * @returns 旅程列表
 */
export async function getTripList(
  options?: {
    userId?: string;
  }
): Promise<{ data: Trip[]; error: Error | null }> {
  try {
    const where: Prisma.TripWhereInput = {};

    // 如果指定使用者，過濾該使用者的旅程
    if (options?.userId) {
      where.user_id = options.userId;
    }

    const trips = await prisma.trip.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    }) as TripRecord[];

    // 轉換為 Domain Model
    const tripList = mapTripList(trips);

    return { data: tripList, error: null };
  } catch (error) {
    console.error('Error fetching trip list:', error);
    return { 
      data: [], 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 根據 ID 或 slug 獲取公開旅程（不檢查擁有者）
 * 
 * @param identifier - 旅程 ID (UUID) 或 slug
 * @returns 旅程資料
 */
export async function getPublicTrip(
  identifier: string
): Promise<{ data: Trip | null; error: Error | null }> {
  try {
    // 先嘗試用 slug 查詢
    let trip = (await prisma.trip.findUnique({
      where: { slug: identifier },
    })) as TripRecord | null;

    // 如果沒找到，再用 id 查詢
    if (!trip) {
      trip = (await prisma.trip.findUnique({
        where: { id: identifier },
      })) as TripRecord | null;
    }

    if (!trip) {
      return { data: null, error: null };
    }

    return { data: mapTrip(trip), error: null };
  } catch (error) {
    console.error('Error fetching trip by ID:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 確認旅程屬於指定使用者後回傳資料
 * 
 * @param id - 旅程 ID
 * @param userId - 使用者 ID
 */
export async function getOwnedTrip(
  id: string,
  userId: string
): Promise<{ data: Trip | null; error: Error | null }> {
  try {
    const trip = (await prisma.trip.findFirst({
      where: {
        id,
        user_id: userId,
      },
    })) as TripRecord | null;

    return { data: trip ? mapTrip(trip) : null, error: null };
  } catch (error) {
    console.error('Error fetching owned trip:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 根據 slug 獲取旅程的 UUID
 * 
 * @param slug - 旅程的 slug
 * @returns UUID
 */
export async function getTripUuidBySlug(
  slug: string
): Promise<{ data: string | null; error: Error | null }> {
  try {
    const trip = await prisma.trip.findUnique({
      where: { slug },
      select: { id: true },
    });

    return { data: trip?.id || null, error: null };
  } catch (error) {
    console.error('Error fetching trip UUID by slug:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 建立新旅程
 * 
 * ⚠️ 權限檢查：必須提供有效的 userId
 * 
 * @param data - 旅程資料
 * @param userId - 使用者 ID
 * @returns 新建立的旅程
 */
export async function createTrip(
  data: {
    title: string;
    description?: string;
    location?: string;
    duration?: string;
    date?: Date;
    images?: string[];
    tags?: string[];
    slug?: string;
  },
  userId: string
): Promise<{ data: Trip | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    const trip = (await prisma.trip.create({
      data: {
        user_id: userId,
        title: data.title,
        description: data.description,
        location: data.location,
        duration: data.duration,
        date: data.date,
        images: data.images || [],
        tags: data.tags || [],
        slug: data.slug,
      },
    })) as TripRecord;

    return { data: mapTrip(trip), error: null };
  } catch (error) {
    console.error('Error creating trip:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 更新旅程
 * 
 * ⚠️ 權限檢查：只有擁有者可以更新
 * 
 * @param id - 旅程 ID
 * @param data - 更新資料
 * @param userId - 使用者 ID
 * @returns 更新後的旅程
 */
export async function updateTrip(
  id: string,
  data: {
    title?: string;
    description?: string;
    location?: string;
    duration?: string;
    date?: Date | null;
    images?: string[];
    tags?: string[];
    slug?: string;
  },
  userId: string
): Promise<{ data: Trip | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 先檢查旅程是否存在且屬於該使用者
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
      select: { user_id: true },
    });

    if (!existingTrip) {
      throw new Error('Trip not found');
    }

    if (existingTrip.user_id !== userId) {
      throw new Error('Unauthorized: You can only update your own trips');
    }

    // 執行更新
    const trip = (await prisma.trip.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.images !== undefined && { images: data.images }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.slug !== undefined && { slug: data.slug }),
        updated_at: new Date(),
      },
    })) as TripRecord;

    return { data: mapTrip(trip), error: null };
  } catch (error) {
    console.error('Error updating trip:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 刪除旅程
 * 
 * ⚠️ 權限檢查：只有擁有者可以刪除
 * ⚠️ 關聯資料：trip_gear 會因 CASCADE 自動刪除
 * 
 * @param id - 旅程 ID
 * @param userId - 使用者 ID
 * @returns 是否成功刪除
 */
export async function deleteTrip(
  id: string,
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 先檢查旅程是否存在且屬於該使用者
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
      select: { user_id: true },
    });

    if (!existingTrip) {
      throw new Error('Trip not found');
    }

    if (existingTrip.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own trips');
    }

    // 執行刪除
    await prisma.trip.delete({
      where: { id },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting trip:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * 獲取旅程及其關聯的裝備
 * 
 * @param id - 旅程 ID (UUID) 或 slug
 * @returns 旅程資料和裝備列表
 */
export async function getTripWithEquipment(
  id: string
): Promise<{ 
  data: { trip: Trip; equipment: Equipment[] } | null; 
  error: Error | null 
}> {
  try {
    // 先嘗試用 slug 查詢
    let trip = (await prisma.trip.findUnique({
      where: { slug: id },
      include: {
        trip_gear: {
          include: {
            gear: true,
          },
        },
      },
    })) as TripWithGear | null;

    // 如果沒找到，再用 id 查詢
    if (!trip) {
      trip = (await prisma.trip.findUnique({
        where: { id },
        include: {
          trip_gear: {
            include: {
              gear: true,
            },
          },
        },
      })) as TripWithGear | null;
    }

    if (!trip) {
      return { data: null, error: new Error('Trip not found') };
    }

    const result = mapTripWithEquipment(trip as TripWithGear);

    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching trip with equipment:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
