"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * ConfirmDeleteDialog Props
 */
export interface ConfirmDeleteDialogProps {
  /** 彈窗開啟狀態 */
  open: boolean;
  /** 關閉彈窗的回調函數 */
  onClose: () => void;
  /** 對話框標題 */
  title: string;
  /** 對話框描述（可以是字串或 React 節點） */
  description: string | React.ReactNode;
  /** 確認按鈕文字 */
  confirmLabel?: string;
  /** 確認中按鈕文字 */
  confirmingLabel?: string;
  /** 取消按鈕文字 */
  cancelLabel?: string;
  /** 確認刪除的回調函數 */
  onConfirm: () => Promise<void>;
}

/**
 * ConfirmDeleteDialog - 通用刪除確認對話框
 *
 * 用於確認刪除操作的通用元件
 * - 按鈕垂直排列（刪除按鈕在上，取消在下）
 * - 文字置中對齊
 * - 支援自訂標題、描述和按鈕文字
 */
export function ConfirmDeleteDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "刪除",
  confirmingLabel = "刪除中...",
  cancelLabel = "取消",
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error in delete operation:", error);
      // 錯誤處理可以在這裡顯示錯誤訊息
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* 垂直排列按鈕：刪除在上，取消在下 */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? confirmingLabel : confirmLabel}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full"
          >
            {cancelLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
