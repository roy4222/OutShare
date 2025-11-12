"use client";

import React from "react";
import { RenameEntityDialog } from "@/components/shared/modals/RenameEntityDialog";

const CATEGORY_NAME_MAX_LENGTH = 20;

/**
 * AddCategoryDialog Props
 */
interface AddCategoryDialogProps {
  /** 彈窗開啟狀態 */
  open: boolean;
  /** 關閉彈窗的回調函數 */
  onClose: () => void;
  /** 確認新增類別的回調函數，返回類別名稱 */
  onConfirm: (categoryName: string) => Promise<void>;
}

/**
 * AddCategoryDialog - 新增裝備類別對話框
 *
 * 使用 RenameEntityDialog 元件實作，用於輸入新類別名稱
 * 確認後會觸發 onConfirm 回調
 */
export function AddCategoryDialog({
  open,
  onClose,
  onConfirm,
}: AddCategoryDialogProps) {
  const handleSubmit = async (categoryName: string) => {
    // 等待 onConfirm 完成，讓對話框能正確顯示 loading 狀態和錯誤訊息
    return await onConfirm(categoryName);
  };

  return (
    <RenameEntityDialog
      open={open}
      onClose={onClose}
      defaultValue=""
      title="類別名稱"
      description="輸入新類別的名稱，之後可在此類別下新增裝備。"
      label="類別"
      placeholder="請輸入類別名稱"
      maxLength={CATEGORY_NAME_MAX_LENGTH}
      emptyErrorMessage="類別名稱不可為空"
      maxLengthErrorMessage={`類別名稱不可超過 ${CATEGORY_NAME_MAX_LENGTH} 字元`}
      confirmLabel="確定"
      confirmingLabel="確定中..."
      cancelLabel="取消"
      inputId="category-name"
      onSubmit={handleSubmit}
      confirmButtonProps={{
        className: "bg-green-700 hover:bg-green-800 text-white",
      }}
    />
  );
}
