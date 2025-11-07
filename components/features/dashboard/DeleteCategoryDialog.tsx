"use client";

import React from "react";
import { ConfirmDeleteDialog } from "@/components/shared/modals/ConfirmDeleteDialog";

/**
 * DeleteCategoryDialog Props
 */
interface DeleteCategoryDialogProps {
  /** 彈窗開啟狀態 */
  open: boolean;
  /** 關閉彈窗的回調函數 */
  onClose: () => void;
  /** 要刪除的類別名稱 */
  categoryName: string;
  /** 確認刪除的回調函數 */
  onConfirm: () => Promise<void>;
}

/**
 * DeleteCategoryDialog - 刪除裝備類別確認對話框
 *
 * 用於確認刪除類別操作，會同時刪除該類別下的所有裝備
 * 使用 ConfirmDeleteDialog 共用元件實作
 */
export function DeleteCategoryDialog({
  open,
  onClose,
  categoryName,
  onConfirm,
}: DeleteCategoryDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onClose={onClose}
      title="確定刪除類別？"
      description={
        <>
          <span className="text-gray-600 font-medium">
            刪除後將無法復原，此類別底下的裝備也將被刪除。
          </span>
        </>
      }
      confirmLabel="刪除"
      confirmingLabel="刪除中..."
      cancelLabel="取消"
      onConfirm={onConfirm}
    />
  );
}
