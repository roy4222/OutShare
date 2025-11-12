/**
 * Categories Service
 *
 * 處理裝備類別的資料庫操作
 */

import { db } from '@/lib/db';
import { categories, gear, type Category } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

/**
 * 根據使用者 ID 獲取所有類別
 *
 * @param userId - 使用者 ID
 * @returns 類別列表
 */
export async function getCategoriesByUserId(
  userId: string
): Promise<{ data: Category[] | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    const userCategories = await db.query.categories.findMany({
      where: eq(categories.user_id, userId),
      orderBy: (categories, { asc }) => [asc(categories.created_at)],
    });

    return { data: userCategories, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 創建新類別
 *
 * @param name - 類別名稱
 * @param userId - 使用者 ID
 * @returns 新建的類別
 */
export async function createCategory(
  name: string,
  userId: string
): Promise<{ data: Category | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 完整驗證
    if (!name || name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (name.trim().length > 20) {
      throw new Error('Category name must be 20 characters or less');
    }

    // 檢查是否已存在同名類別
    const existing = await db.query.categories.findFirst({
      where: and(
        eq(categories.user_id, userId),
        eq(categories.name, name.trim())
      ),
    });

    if (existing) {
      throw new Error('Category with this name already exists');
    }

    const [newCategory] = await db.insert(categories).values({
      user_id: userId,
      name: name.trim(),
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return { data: newCategory, error: null };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 更新類別名稱
 *
 * ⚠️ 權限檢查：只有擁有者可以更新
 *
 * @param id - 類別 ID
 * @param name - 新類別名稱
 * @param userId - 使用者 ID
 * @returns 更新後的類別
 */
export async function updateCategory(
  id: string,
  name: string,
  userId: string
): Promise<{ data: Category | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 完整驗證
    if (!name || name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (name.trim().length > 20) {
      throw new Error('Category name must be 20 characters or less');
    }

    // 先檢查類別是否存在且屬於該使用者
    const existingCategory = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (existingCategory.user_id !== userId) {
      throw new Error('Unauthorized: You can only update your own categories');
    }

    // 檢查新名稱是否與其他類別重複
    const duplicate = await db.query.categories.findFirst({
      where: and(
        eq(categories.user_id, userId),
        eq(categories.name, name.trim())
      ),
    });

    if (duplicate && duplicate.id !== id) {
      throw new Error('Category with this name already exists');
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        name: name.trim(),
        updated_at: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    return { data: updatedCategory, error: null };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 刪除類別
 *
 * ⚠️ 權限檢查：只有擁有者可以刪除
 *
 * @param id - 類別 ID
 * @param userId - 使用者 ID
 * @returns 成功與否
 */
export async function deleteCategory(
  id: string,
  userId: string
): Promise<{ data: boolean; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 先檢查類別是否存在且屬於該使用者
    const existingCategory = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (existingCategory.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own categories');
    }

    await db.delete(categories).where(eq(categories.id, id));

    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      data: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 重新命名類別並更新所有相關裝備（使用交易）
 *
 * ⚠️ 權限檢查：只有擁有者可以更新
 * ⚠️ 使用交易確保原子性：如果任何操作失敗，整個交易會回滾
 *
 * @param id - 類別 ID
 * @param newName - 新類別名稱
 * @param equipmentIds - 需要更新的裝備 ID 列表
 * @param userId - 使用者 ID
 * @returns 更新後的類別
 */
export async function renameCategoryWithEquipment(
  id: string,
  newName: string,
  equipmentIds: string[],
  userId: string
): Promise<{ data: Category | null; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    if (!newName || newName.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (newName.trim().length > 20) {
      throw new Error('Category name must be 20 characters or less');
    }

    // 使用交易執行所有操作
    const result = await db.transaction(async (tx) => {
      // 1. 檢查類別是否存在且屬於該使用者
      const existingCategory = await tx.query.categories.findFirst({
        where: eq(categories.id, id),
      });

      if (!existingCategory) {
        throw new Error('Category not found');
      }

      if (existingCategory.user_id !== userId) {
        throw new Error('Unauthorized: You can only update your own categories');
      }

      // 2. 檢查新名稱是否與其他類別重複
      const duplicate = await tx.query.categories.findFirst({
        where: and(
          eq(categories.user_id, userId),
          eq(categories.name, newName.trim())
        ),
      });

      if (duplicate && duplicate.id !== id) {
        throw new Error('Category with this name already exists');
      }

      // 3. 更新類別名稱
      const [updatedCategory] = await tx
        .update(categories)
        .set({
          name: newName.trim(),
          updated_at: new Date(),
        })
        .where(eq(categories.id, id))
        .returning();

      // 4. 更新所有相關裝備的 category 欄位（批次更新）
      if (equipmentIds.length > 0) {
        // 先驗證所有裝備都屬於該使用者
        const equipmentToUpdate = await tx.query.gear.findMany({
          where: and(
            inArray(gear.id, equipmentIds),
            eq(gear.user_id, userId)
          ),
        });

        if (equipmentToUpdate.length !== equipmentIds.length) {
          throw new Error('Some equipment not found or unauthorized');
        }

        // 批次更新裝備的類別名稱
        await tx
          .update(gear)
          .set({
            category: newName.trim(),
            updated_at: new Date(),
          })
          .where(inArray(gear.id, equipmentIds));
      }

      return updatedCategory;
    });

    return { data: result, error: null };
  } catch (error) {
    console.error('Error renaming category with equipment:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * 刪除類別並刪除所有相關裝備（使用交易）
 *
 * ⚠️ 權限檢查：只有擁有者可以刪除
 * ⚠️ 使用交易確保原子性：如果任何操作失敗，整個交易會回滾
 *
 * @param id - 類別 ID
 * @param equipmentIds - 需要刪除的裝備 ID 列表
 * @param userId - 使用者 ID
 * @returns 成功與否
 */
export async function deleteCategoryWithEquipment(
  id: string,
  equipmentIds: string[],
  userId: string
): Promise<{ data: boolean; error: Error | null }> {
  try {
    if (!userId) {
      throw new Error('Unauthorized: userId is required');
    }

    // 使用交易執行所有操作
    await db.transaction(async (tx) => {
      // 1. 檢查類別是否存在且屬於該使用者
      const existingCategory = await tx.query.categories.findFirst({
        where: eq(categories.id, id),
      });

      if (!existingCategory) {
        throw new Error('Category not found');
      }

      if (existingCategory.user_id !== userId) {
        throw new Error('Unauthorized: You can only delete your own categories');
      }

      // 2. 刪除所有相關裝備
      if (equipmentIds.length > 0) {
        // 先驗證所有裝備都屬於該使用者
        const equipmentToDelete = await tx.query.gear.findMany({
          where: and(
            inArray(gear.id, equipmentIds),
            eq(gear.user_id, userId)
          ),
        });

        if (equipmentToDelete.length !== equipmentIds.length) {
          throw new Error('Some equipment not found or unauthorized');
        }

        // 批次刪除裝備（連帶刪除 trip_gear 關聯，因為有 cascade）
        await tx.delete(gear).where(inArray(gear.id, equipmentIds));
      }

      // 3. 刪除類別
      await tx.delete(categories).where(eq(categories.id, id));
    });

    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting category with equipment:', error);
    return {
      data: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}
