/**
 * useCategories Hook
 *
 * 管理裝備類別的 React Hook
 * 提供獲取、創建、更新、刪除類別的功能
 */

import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/lib/db/schema';

export interface UseCategoriesOptions {
  userId?: string;
  autoFetch?: boolean; // 是否自動獲取類別（預設 true）
}

export interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createCategory: (name: string) => Promise<Category>;
  updateCategory: (id: string, name: string) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  renameCategoryWithEquipment: (id: string, newName: string, equipmentIds: string[]) => Promise<Category>;
  deleteCategoryWithEquipment: (id: string, equipmentIds: string[]) => Promise<void>;
}

/**
 * useCategories Hook
 *
 * @param options - Hook 選項
 * @returns 類別資料與操作方法
 *
 * @example
 * ```tsx
 * const { categories, isLoading, createCategory, refetch } = useCategories();
 *
 * // 創建類別
 * await createCategory('登山裝備');
 * ```
 */
export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesReturn {
  const { autoFetch = true } = options;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  // 獲取類別列表
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/categories');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch categories');
      }

      setCategories(result.data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 自動獲取類別
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  // 創建類別
  const createCategory = useCallback(async (name: string): Promise<Category> => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create category');
      }

      // 重新獲取類別列表
      await fetchCategories();

      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error creating category:', error);
      throw error;
    }
  }, [fetchCategories]);

  // 更新類別名稱
  const updateCategory = useCallback(async (id: string, name: string): Promise<Category> => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update category');
      }

      // 重新獲取類別列表
      await fetchCategories();

      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error updating category:', error);
      throw error;
    }
  }, [fetchCategories]);

  // 刪除類別
  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete category');
      }

      // 重新獲取類別列表
      await fetchCategories();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error deleting category:', error);
      throw error;
    }
  }, [fetchCategories]);

  // 重新命名類別並更新相關裝備（使用交易）
  const renameCategoryWithEquipment = useCallback(
    async (id: string, newName: string, equipmentIds: string[]): Promise<Category> => {
      try {
        const response = await fetch(`/api/categories/${id}/rename`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newName, equipmentIds }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to rename category');
        }

        // 重新獲取類別列表
        await fetchCategories();

        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error renaming category with equipment:', error);
        throw error;
      }
    },
    [fetchCategories]
  );

  // 刪除類別並刪除相關裝備（使用交易）
  const deleteCategoryWithEquipment = useCallback(
    async (id: string, equipmentIds: string[]): Promise<void> => {
      try {
        const response = await fetch(`/api/categories/${id}/delete-with-equipment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ equipmentIds }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to delete category with equipment');
        }

        // 重新獲取類別列表
        await fetchCategories();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error deleting category with equipment:', error);
        throw error;
      }
    },
    [fetchCategories]
  );

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    renameCategoryWithEquipment,
    deleteCategoryWithEquipment,
  };
}
