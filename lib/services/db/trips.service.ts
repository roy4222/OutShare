/**
 * Trips Drizzle Service
 *
 * 處理旅程相關的資料庫查詢操作（使用 Drizzle ORM）
 *
 * ⚠️ 重要提醒：
 * - 所有寫入操作（create, update, delete）必須驗證 userId
 * - Drizzle 不會自動執行 RLS 政策，需在應用層檢查權限
 */

import { db } from '@/lib/db';
import { trip } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { Trip } from '@/lib/types/trip';
import { Equipment } from '@/lib/types/equipment';
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
    const whereCondition = options?.userId ? eq(trip.user_id, options.userId) : undefined;

    const trips = await db.query.trip.findMany({
      where: whereCondition,
      orderBy: desc(trip.created_at),
    });

    // 轉換為 Domain Model
    const tripList = mapTripList(trips as TripRecord[]);

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
    let tripData = await db.query.trip.findFirst({
      where: eq(trip.slug, identifier),
    });

    // 如果沒找到，再用 id 查詢
    if (!tripData) {
      tripData = await db.query.trip.findFirst({
        where: eq(trip.id, identifier),
      });
    }

    if (!tripData) {
      return { data: null, error: null };
    }

    return { data: mapTrip(tripData as TripRecord), error: null };
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
    const tripData = await db.query.trip.findFirst({
      where: and(
        eq(trip.id, id),
        eq(trip.user_id, userId)
      ),
    });

    return { data: tripData ? mapTrip(tripData as TripRecord) : null, error: null };
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
    const tripData = await db.query.trip.findFirst({
      where: eq(trip.slug, slug),
      columns: {
        id: true,
      },
    });

    return { data: tripData?.id || null, error: null };
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

    const [newTrip] = await db.insert(trip).values({
      user_id: userId,
      title: data.title,
      description: data.description,
      location: data.location,
      duration: data.duration,
      date: data.date,
      images: data.images || [],
      tags: data.tags || [],
      slug: data.slug,
    }).returning();

    return { data: mapTrip(newTrip as TripRecord), error: null };
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
    const existingTrip = await db.query.trip.findFirst({
      where: eq(trip.id, id),
      columns: {
        user_id: true,
      },
    });

    if (!existingTrip) {
      throw new Error('Trip not found');
    }

    if (existingTrip.user_id !== userId) {
      throw new Error('Unauthorized: You can only update your own trips');
    }

    // 建立更新物件
    const updateData: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.slug !== undefined) updateData.slug = data.slug;

    // 執行更新
    const [updatedTrip] = await db
      .update(trip)
      .set(updateData)
      .where(eq(trip.id, id))
      .returning();

    return { data: mapTrip(updatedTrip as TripRecord), error: null };
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
    const existingTrip = await db.query.trip.findFirst({
      where: eq(trip.id, id),
      columns: {
        user_id: true,
      },
    });

    if (!existingTrip) {
      throw new Error('Trip not found');
    }

    if (existingTrip.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own trips');
    }

    // 執行刪除
    await db.delete(trip).where(eq(trip.id, id));

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
    let tripData = await db.query.trip.findFirst({
      where: eq(trip.slug, id),
      with: {
        trip_gear: {
          with: {
            gear: true,
          },
        },
      },
    });

    // 如果沒找到，再用 id 查詢
    if (!tripData) {
      tripData = await db.query.trip.findFirst({
        where: eq(trip.id, id),
        with: {
          trip_gear: {
            with: {
              gear: true,
            },
          },
        },
      });
    }

    if (!tripData) {
      return { data: null, error: new Error('Trip not found') };
    }

    const result = mapTripWithEquipment(tripData as unknown as TripWithGear);

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
