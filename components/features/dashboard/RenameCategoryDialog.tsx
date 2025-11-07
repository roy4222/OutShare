"use client";

import React from "react";
import { RenameEntityDialog } from "@/components/shared/modals/RenameEntityDialog";

const CATEGORY_NAME_MAX_LENGTH = 20;

/**
 * RenameCategoryDialog Props
 */
interface RenameCategoryDialogProps {
  /** 彈窗開啟狀態 */
  open: boolean;
  /** 關閉彈窗的回調函數 */
  onClose: () => void;
  /** 當前類別名稱 */
  currentName: string;
  /** 確認重新命名的回調函數，返回新類別名稱 */
  onConfirm: (newCategoryName: string) => Promise<void>;
}

/**
 * RenameCategoryDialog - 重新命名裝備類別對話框
 *
 * 使用 RenameEntityDialog 元件實作，用於修改現有類別名稱
 * 確認後會觸發 onConfirm 回調
 */
export function RenameCategoryDialog({
  open,
  onClose,
  currentName,
  onConfirm,
}: RenameCategoryDialogProps) {
  const handleSubmit = async (newCategoryName: string) => {
    // 等待 onConfirm 完成，讓 dialog 能顯示 loading 狀態
    await onConfirm(newCategoryName);
  };

  return (
    <RenameEntityDialog
      open={open}
      onClose={onClose}
      defaultValue={currentName}
      title="重新命名類別"
      description="輸入新的類別名稱，該類別下的所有裝備將會一併更新。"
      label="類別名稱"
      placeholder="請輸入類別名稱"
      maxLength={CATEGORY_NAME_MAX_LENGTH}
      emptyErrorMessage="類別名稱不可為空"
      maxLengthErrorMessage={`類別名稱不可超過 ${CATEGORY_NAME_MAX_LENGTH} 字元`}
      confirmLabel="確定"
      confirmingLabel="儲存中..."
      cancelLabel="取消"
      inputId="rename-category-name"
      onSubmit={handleSubmit}
      confirmButtonProps={{
        className: "bg-green-700 hover:bg-green-800 text-white",
      }}
    />
  );
}
