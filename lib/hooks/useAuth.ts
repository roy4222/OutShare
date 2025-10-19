/**
 * useAuth Hook
 * 
 * 封裝 Supabase 認證邏輯，提供統一的使用者狀態管理
 * 
 * @example
 * ```tsx
 * const { user, loading, signOut } = useAuth();
 * 
 * if (loading) return <div>載入中...</div>;
 * if (!user) return <div>請先登入</div>;
 * ```
 */

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface UseAuthOptions {
  /** 是否需要認證（未登入時自動重導向） */
  requireAuth?: boolean;
  /** 未登入時的重導向路徑 */
  redirectTo?: string;
}

interface UseAuthReturn {
  /** 當前使用者 */
  user: User | null;
  /** 是否正在載入 */
  loading: boolean;
  /** 登出函數 */
  signOut: () => Promise<void>;
  /** 重新獲取使用者資料 */
  refetch: () => Promise<User | null>;
}

/**
 * 認證 Hook
 * 
 * @param options - 認證選項
 * @returns 使用者狀態和認證相關函數
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { requireAuth = false, redirectTo = '/' } = options;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  /**
   * 獲取使用者資料
   */
  const fetchUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      // 如果需要認證但使用者未登入，則重導向
      if (requireAuth && !user) {
        router.push(redirectTo);
      }

      return user;
    } catch (error) {
      console.error('取得使用者資料時發生錯誤:', error);
      setUser(null);
      
      if (requireAuth) {
        router.push(redirectTo);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [requireAuth, redirectTo, router, supabase.auth]);

  /**
   * 登出函數
   */
  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('登出錯誤:', error.message);
        throw error;
      }
      // 登出成功後會自動觸發 onAuthStateChange
    } catch (error) {
      console.error('未預期的錯誤:', error);
      throw error;
    }
  }, [supabase.auth]);

  // 初始化和監聽認證狀態變化
  useEffect(() => {
    // 初始獲取使用者資料
    fetchUser();

    // 監聽認證狀態變化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      // 如果需要認證但使用者登出了，則重導向
      if (requireAuth && !newUser) {
        router.push(redirectTo);
      }
    });

    // 清理監聽器
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser, requireAuth, redirectTo, router, supabase.auth]);

  return {
    user,
    loading,
    signOut: handleSignOut,
    refetch: fetchUser,
  };
}

/**
 * 使用受保護的認證（需要登入）
 * 
 * 這是 useAuth 的簡化版本，專門用於受保護的頁面
 * 
 * @example
 * ```tsx
 * const { user, loading, signOut } = useRequireAuth();
 * ```
 */
export function useRequireAuth(): UseAuthReturn {
  return useAuth({ requireAuth: true, redirectTo: '/' });
}

