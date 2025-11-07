/**
 * Equipment Drizzle Service
 *
 * 處理裝備相關的資料庫查詢操作（使用 Drizzle ORM）
 *
 * ⚠️ 重要提醒：
 * - 所有寫入操作（create, update, delete）必須驗證 userId
 * - Drizzle 不會自動執行 RLS 政策，需在應用層檢查權限
 */

import { db } from '@/lib/db';
import { gear, tripGear, trip } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { Equipment } from '@/lib/types/equipment';
import {
  mapGear,
  mapGearList,
  type GearWithRelations,
  type GearSpecs,
} from '@/lib/mappers/equipment';

/**
 * 獲取裝備列表
 *
 * @param options - 查詢選項
 * @returns 裝備列表
 */
export async function getEquipmentList(
  options?: {
    userId?: string;
    tripId?: string;
    includeTrips?: boolean;
  }
): Promise<{ data: Equipment[]; error: Error | null }> {
  try {
    let whereCondition;

    // 如果指定使用者
    if (options?.userId) {
      whereCondition = eq(gear.user_id, options.userId);
    }

    // 如果指定旅程，透過 trip_gear 關聯查詢
    if (options?.tripId) {
      const gearIds = await db
        .select({ gear_id: tripGear.gear_id })
        .from(tripGear)
        .where(eq(tripGear.trip_id, options.tripId));

      const gearList = await db.query.gear.findMany({
        where: and(
          whereCondition,
          gearIds.length > 0 ? undefined : eq(gear.id, '') // 如果沒有裝備，返回空陣列
        ),
        orderBy: desc(gear.created_at),
        with: options?.includeTrips ? {
          trip_gear: {
            with: {
              trip: {
                columns: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        } : undefined,
      });

      // 過濾出符合 tripId 的裝備
      const filteredGearList = gearList.filter(g =>
        gearIds.some(tg => tg.gear_id === g.id)
      );

      return {
        data: mapGearList(filteredGearList as GearWithRelations[], {
          includeTrips: options?.includeTrips,
        }),
        error: null,
      };
    }

    const gearList = await db.query.gear.findMany({
      where: whereCondition,
      orderBy: desc(gear.created_at),
      with: options?.includeTrips ? {
        trip_gear: {
          with: {
            trip: {
              columns: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      } : undefined,
    });

    // 轉換為 Domain Model
    const equipmentList = mapGearList(gearList as GearWithRelations[], {
      includeTrips: options?.includeTrips,
    });

    return { data: equipmentList, error: null };
  } catch (error) {
    console.error('Error fetching equipment list:', error);
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 根據 ID 獲取單一裝備
 *
 * @param id - 裝備 ID (UUID)
 * @returns 裝備資料
 */
export async function getEquipmentById(
  id: string
): Promise<{ data: Equipment | null; error: Error | null }> {
  try {
    const gearData = await db.query.gear.findFirst({
      where: eq(gear.id, id),
      with: {
        trip_gear: {
          with: {
            trip: {
              columns: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!gearData) {
      return { data: null, error: null };
    }

    return {
      data: mapGear(gearData as GearWithRelations, { includeTrips: true }),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching equipment by ID:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 根據 ID 與使用者驗證擁有權後返回裝備
 */
export async function getOwnedEquipment(
  id: string,
  userId: string
): Promise<{ data: Equipment | null; error: Error | null }> {
  try {
    const gearData = await db.query.gear.findFirst({
      where: and(
        eq(gear.id, id),
        eq(gear.user_id, userId)
      ),
    });

    return {
      data: gearData ? mapGear(gearData as GearWithRelations) : null,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching owned equipment:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 獲取旅程的所有裝備（透過 trip_gear 關聯）
 *
 * @param tripId - 旅程 ID (UUID)
 * @returns 裝備列表
 */
export async function getEquipmentByTrip(
  tripId: string
): Promise<{ data: Equipment[]; error: Error | null }> {
  return getEquipmentList({ tripId, includeTrips: false });
}

/**
 * 建立新裝備
 *
 * ⚠️ 權限檢查：必須提供有效的 userId
 *
 * @param data - 裝備資料
 * @param userId - 使用者 ID
 * @returns 新建立的裝備
 */
export async function createEquipment(
  data: {
    name: string;
    category?: string;
    description?: string;
    image_url?: string;
    specs?: GearSpecs;
    tags?: string[];
  },
  userId: string
): Promise<{ data: Equipment | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    const [newGear] = await db.insert(gear).values({
      user_id: userId,
      name: data.name,
      category: data.category,
      description: data.description,
      image_url: data.image_url,
      specs: data.specs || {},
      tags: data.tags || [],
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return { data: mapGear(newGear as GearWithRelations), error: null };
  } catch (error) {
    console.error('Error creating equipment:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 更新裝備
 *
 * ⚠️ 權限檢查：只有擁有者可以更新
 *
 * @param id - 裝備 ID
 * @param data - 更新資料
 * @param userId - 使用者 ID
 * @returns 更新後的裝備
 */
export async function updateEquipment(
  id: string,
  data: {
    name?: string;
    category?: string;
    description?: string;
    image_url?: string;
    specs?: GearSpecs;
    tags?: string[];
  },
  userId: string
): Promise<{ data: Equipment | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 先檢查裝備是否存在且屬於該使用者
    const existingGear = await db.query.gear.findFirst({
      where: eq(gear.id, id),
      columns: {
        user_id: true,
      },
    });

    if (!existingGear) {
      throw new Error('Equipment not found');
    }

    if (existingGear.user_id !== userId) {
      throw new Error('Unauthorized: You can only update your own equipment');
    }

    // 建立更新物件
    const updateData: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    if (data.specs !== undefined) updateData.specs = data.specs;
    if (data.tags !== undefined) updateData.tags = data.tags;

    // 執行更新
    const [updatedGear] = await db
      .update(gear)
      .set(updateData)
      .where(eq(gear.id, id))
      .returning();

    return { data: mapGear(updatedGear as GearWithRelations), error: null };
  } catch (error) {
    console.error('Error updating equipment:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 刪除裝備
 *
 * ⚠️ 權限檢查：只有擁有者可以刪除
 * ⚠️ 關聯資料：trip_gear 會因 CASCADE 自動刪除
 *
 * @param id - 裝備 ID
 * @param userId - 使用者 ID
 * @returns 是否成功刪除
 */
export async function deleteEquipment(
  id: string,
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 先檢查裝備是否存在且屬於該使用者
    const existingGear = await db.query.gear.findFirst({
      where: eq(gear.id, id),
      columns: {
        user_id: true,
      },
    });

    if (!existingGear) {
      throw new Error('Equipment not found');
    }

    if (existingGear.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own equipment');
    }

    // 執行刪除
    await db.delete(gear).where(eq(gear.id, id));

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 為旅程新增裝備關聯
 *
 * ⚠️ 權限檢查：只有旅程擁有者可以新增
 *
 * @param tripId - 旅程 ID
 * @param gearId - 裝備 ID
 * @param userId - 使用者 ID
 * @returns 是否成功新增
 */
export async function addEquipmentToTrip(
  tripId: string,
  gearId: string,
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 檢查旅程是否屬於該使用者
    const tripData = await db.query.trip.findFirst({
      where: eq(trip.id, tripId),
      columns: {
        user_id: true,
      },
    });

    if (!tripData) {
      throw new Error('Trip not found');
    }

    if (tripData.user_id !== userId) {
      throw new Error('Unauthorized: You can only modify your own trips');
    }

    // 建立關聯
    await db.insert(tripGear).values({
      trip_id: tripId,
      gear_id: gearId,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error adding equipment to trip:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 從旅程移除裝備關聯
 *
 * ⚠️ 權限檢查：只有旅程擁有者可以移除
 *
 * @param tripId - 旅程 ID
 * @param gearId - 裝備 ID
 * @param userId - 使用者 ID
 * @returns 是否成功移除
 */
export async function removeEquipmentFromTrip(
  tripId: string,
  gearId: string,
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 檢查旅程是否屬於該使用者
    const tripData = await db.query.trip.findFirst({
      where: eq(trip.id, tripId),
      columns: {
        user_id: true,
      },
    });

    if (!tripData) {
      throw new Error('Trip not found');
    }

    if (tripData.user_id !== userId) {
      throw new Error('Unauthorized: You can only modify your own trips');
    }

    // 刪除關聯
    await db.delete(tripGear).where(
      and(
        eq(tripGear.trip_id, tripId),
        eq(tripGear.gear_id, gearId)
      )
    );

    return { success: true, error: null };
  } catch (error) {
    console.error('Error removing equipment from trip:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}
