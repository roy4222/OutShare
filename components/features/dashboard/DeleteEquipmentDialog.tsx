"use client";

import React from "react";
import { ConfirmDeleteDialog } from "@/components/shared/modals/ConfirmDeleteDialog";

/**
 * DeleteEquipmentDialog Props
 */
interface DeleteEquipmentDialogProps {
  /** 彈窗開啟狀態 */
  open: boolean;
  /** 關閉彈窗的回調函數 */
  onClose: () => void;
  /** 要刪除的裝備名稱 */
  equipmentName: string;
  /** 確認刪除的回調函數 */
  onConfirm: () => Promise<void>;
}

/**
 * DeleteEquipmentDialog - 刪除裝備確認對話框
 *
 * 用於確認刪除裝備操作
 * 使用 ConfirmDeleteDialog 共用元件實作
 */
export function DeleteEquipmentDialog({
  open,
  onClose,
  equipmentName,
  onConfirm,
}: DeleteEquipmentDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onClose={onClose}
      title="確定刪除裝備？"
      description={
        <>
          確定要刪除 <span className="font-bold text-gray-900">{equipmentName}</span> 嗎？
          <br />
          <span className="text-gray-600 font-medium">
            刪除後將無法復原。
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

