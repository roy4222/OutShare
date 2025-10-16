"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * 受保護的 Dashboard 頁面
 *
 * 這個頁面示範如何:
 * 1. 檢查使用者的登入狀態
 * 2. 顯示使用者資訊
 * 3. 實作登出功能
 * 4. 當使用者未登入時，重導向到登入頁
 */
export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    /**
     * 檢查使用者的登入狀態
     */
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // 如果沒有登入，重導向到首頁
          router.push("/");
          return;
        }

        setUser(user);
      } catch (error) {
        console.error("取得使用者資料時發生錯誤:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 監聽認證狀態變化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
      }
    });

    // 清理監聽器
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  /**
   * 處理登出
   */
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("登出錯誤:", error.message);
        alert("登出時發生錯誤");
        return;
      }
      // 登出成功後會自動觸發 onAuthStateChange，重導向到首頁
    } catch (error) {
      console.error("未預期的錯誤:", error);
      alert("登出時發生錯誤");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return null; // 將會重導向到首頁
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 頁面標題 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">歡迎回來！</h1>
          <p className="text-gray-600">
            這是受保護的頁面，只有登入的使用者才能看到。
          </p>
        </div>

        {/* 使用者資訊卡片 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">使用者資訊</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">姓名</p>
                <p className="font-medium">
                  {user.user_metadata?.full_name || "未設定"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">使用者 ID</p>
              <p className="font-mono text-sm text-gray-700">{user.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">登入提供者</p>
              <p className="font-medium">
                {user.app_metadata?.provider || "unknown"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">上次登入時間</p>
              <p className="font-medium">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString("zh-TW")
                  : "未知"}
              </p>
            </div>
          </div>
        </div>

        {/* 使用者詳細資料（metadata） */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">詳細資料（Metadata）</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(user.user_metadata, null, 2)}
          </pre>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-4">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="px-6 text-gray-500"
          >
            登出
          </Button>

          <Button
            onClick={() => window.open("/profile", "_blank")}
            variant="outline"
            className="px-6"
          >
            前往個人資料頁
          </Button>
        </div>
      </div>
    </div>
  );
}
