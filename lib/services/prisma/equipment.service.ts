/**
 * Equipment Prisma Service
 * 
 * 處理裝備相關的資料庫查詢操作（使用 Prisma ORM）
 * 
 * ⚠️ 重要提醒：
 * - 所有寫入操作（create, update, delete）必須驗證 userId
 * - Prisma 不會自動執行 RLS 政策，需在應用層檢查權限
 */

import { prisma } from '@/lib/prisma';
import { Equipment } from '@/lib/types/equipment';
import { Prisma } from '@prisma/client';

/**
 * 將 Prisma Gear 資料轉換為 Domain Model
 */
function mapPrismaToEquipment(prismaGear: any): Equipment {
  // 解析 specs (JSON)
  const specs = prismaGear.specs as any || {};

  return {
    name: prismaGear.name,
    brand: specs.brand || '',
    weight: specs.weight_g || 0,
    price: specs.price_twd || 0,
    tags: prismaGear.tags || [],
    buy_link: specs.buy_link || undefined,
    image: prismaGear.image_url || undefined,
    category: prismaGear.category || '',
    trips: undefined, // 需要透過關聯查詢才能取得
  };
}

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
    const where: Prisma.GearWhereInput = {};

    // 如果指定使用者，過濾該使用者的裝備
    if (options?.userId) {
      where.user_id = options.userId;
    }

    // 如果指定旅程，透過 trip_gear 關聯查詢
    if (options?.tripId) {
      where.trip_gear = {
        some: {
          trip_id: options.tripId,
        },
      };
    }

    const gearList = await prisma.gear.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
      include: options?.includeTrips ? {
        trip_gear: {
          include: {
            trip: {
              select: {
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
    const equipmentList = gearList.map((gear) => {
      const equipment = mapPrismaToEquipment(gear);
      
      // 如果需要附加關聯的旅程資訊
      if (options?.includeTrips && 'trip_gear' in gear) {
        equipment.trips = (gear as any).trip_gear.map((tg: any) => tg.trip.title);
      }

      return equipment;
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
    const gear = await prisma.gear.findUnique({
      where: { id },
      include: {
        trip_gear: {
          include: {
            trip: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!gear) {
      return { data: null, error: null };
    }

    const equipment = mapPrismaToEquipment(gear);
    
    // 附加關聯的旅程
    if ('trip_gear' in gear) {
      equipment.trips = (gear as any).trip_gear.map((tg: any) => tg.trip.title);
    }

    return { data: equipment, error: null };
  } catch (error) {
    console.error('Error fetching equipment by ID:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
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
    specs?: {
      brand?: string;
      weight_g?: number;
      price_twd?: number;
      buy_link?: string;
      [key: string]: any;
    };
    tags?: string[];
  },
  userId: string
): Promise<{ data: Equipment | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    const gear = await prisma.gear.create({
      data: {
        user_id: userId,
        name: data.name,
        category: data.category,
        description: data.description,
        image_url: data.image_url,
        specs: data.specs || {},
        tags: data.tags || [],
      },
    });

    return { data: mapPrismaToEquipment(gear), error: null };
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
    specs?: {
      brand?: string;
      weight_g?: number;
      price_twd?: number;
      buy_link?: string;
      [key: string]: any;
    };
    tags?: string[];
  },
  userId: string
): Promise<{ data: Equipment | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 先檢查裝備是否存在且屬於該使用者
    const existingGear = await prisma.gear.findUnique({
      where: { id },
      select: { user_id: true },
    });

    if (!existingGear) {
      throw new Error('Equipment not found');
    }

    if (existingGear.user_id !== userId) {
      throw new Error('Unauthorized: You can only update your own equipment');
    }

    // 執行更新
    const gear = await prisma.gear.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.image_url !== undefined && { image_url: data.image_url }),
        ...(data.specs !== undefined && { specs: data.specs }),
        ...(data.tags !== undefined && { tags: data.tags }),
        updated_at: new Date(),
      },
    });

    return { data: mapPrismaToEquipment(gear), error: null };
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
    const existingGear = await prisma.gear.findUnique({
      where: { id },
      select: { user_id: true },
    });

    if (!existingGear) {
      throw new Error('Equipment not found');
    }

    if (existingGear.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own equipment');
    }

    // 執行刪除
    await prisma.gear.delete({
      where: { id },
    });

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
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { user_id: true },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    if (trip.user_id !== userId) {
      throw new Error('Unauthorized: You can only modify your own trips');
    }

    // 建立關聯
    await prisma.tripGear.create({
      data: {
        trip_id: tripId,
        gear_id: gearId,
      },
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
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { user_id: true },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    if (trip.user_id !== userId) {
      throw new Error('Unauthorized: You can only modify your own trips');
    }

    // 刪除關聯
    await prisma.tripGear.deleteMany({
      where: {
        trip_id: tripId,
        gear_id: gearId,
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error removing equipment from trip:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

