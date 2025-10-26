"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/**
 * CategoryModal Props
 */
interface CategoryModalProps {
  /** 彈窗開啟狀態 */
  open: boolean;
  /** 關閉彈窗的回調函數 */
  onClose: () => void;
  /** 當前標題（用作輸入框預設值） */
  currentTitle: string;
  /** 儲存標題的回調函數 */
  onSave: (newTitle: string) => Promise<void>;
}

/**
 * CategoryModal - 裝備管理頁面標題編輯彈窗
 *
 * 使用 Radix UI Dialog 元件實作，提供標題編輯功能
 */
export function CategoryModal({
  open,
  onClose,
  currentTitle,
  onSave,
}: CategoryModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 當 currentTitle 改變時，更新輸入框的值
  useEffect(() => {
    setTitle(currentTitle);
    setError(null);
  }, [currentTitle, open]);

  /**
   * 處理表單提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 驗證標題
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("標題不可為空");
      return;
    }

    if (trimmedTitle.length > 8) {
      setError("標題長度不可超過 8 字元");
      return;
    }

    // 執行儲存
    setIsLoading(true);
    try {
      await onSave(trimmedTitle);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 處理取消操作
   */
  const handleCancel = () => {
    setTitle(currentTitle); // 重置為原始值
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>編輯</DialogTitle>
            <DialogDescription>
              此處能更改前台「我的裝備」頁籤名稱。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">標題</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="請輸入要更改的名稱"
                maxLength={8}
                disabled={isLoading}
                className="col-span-3 focus-visible:ring-[1px] focus-visible:ring-green-700 focus-visible:border-green-700"
                autoFocus
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <p className="text-xs text-gray-500">{title.length} / 8 字元</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "儲存中..." : "儲存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
