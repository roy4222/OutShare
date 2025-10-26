"use client";

import React from "react";
import { RenameEntityDialog } from "@/components/shared/modals/RenameEntityDialog";

const CATEGORY_TITLE_MAX_LENGTH = 8;

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
  return (
    <RenameEntityDialog
      open={open}
      onClose={onClose}
      defaultValue={currentTitle}
      title="編輯"
      description="此處能更改前台「我的裝備」頁籤名稱。"
      label="標題"
      placeholder="請輸入要更改的名稱"
      maxLength={CATEGORY_TITLE_MAX_LENGTH}
      emptyErrorMessage="標題不可為空"
      maxLengthErrorMessage={`標題長度不可超過 ${CATEGORY_TITLE_MAX_LENGTH} 字元`}
      confirmLabel="儲存"
      confirmingLabel="儲存中..."
      cancelLabel="取消"
      inputId="category-title"
      onSubmit={onSave}
      confirmButtonProps={{
        className: "bg-green-700 hover:bg-green-800 text-white",
      }}
    />
  );
}
