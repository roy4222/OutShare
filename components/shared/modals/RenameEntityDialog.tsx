"use client";

import React, { ComponentProps, useEffect, useId, useState } from "react";
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

interface RenameEntityDialogProps {
  /** Dialog 開啟狀態 */
  open: boolean;
  /** 關閉 dialog 的回呼 */
  onClose: () => void;
  /** 初始值（會在 dialog 再次開啟時重設） */
  defaultValue: string;
  /** Dialog 標題 */
  title: string;
  /** Dialog 說明文字 */
  description?: string;
  /** 輸入欄位標籤 */
  label: string;
  /** 輸入欄位 placeholder */
  placeholder?: string;
  /** 顯示在送出按鈕上的文字 */
  confirmLabel?: string;
  /** 顯示在取消按鈕上的文字 */
  cancelLabel?: string;
  /** 送出按鈕 loading 狀態文字 */
  confirmingLabel?: string;
  /** 限制輸入最大長度 */
  maxLength?: number;
  /** 自訂驗證（回傳 null 表示成功，否則為錯誤訊息） */
  validate?: (value: string) => string | null;
  /** 自訂空值錯誤訊息 */
  emptyErrorMessage?: string;
  /** 自訂長度錯誤訊息 */
  maxLengthErrorMessage?: string;
  /** 送出時觸發，預期回傳 Promise 以統一 loading 狀態 */
  onSubmit: (value: string) => Promise<void>;
  /** 自訂確認按鈕樣式 */
  confirmButtonProps?: Partial<ComponentProps<typeof Button>>;
  /** 自訂取消按鈕樣式 */
  cancelButtonProps?: Partial<ComponentProps<typeof Button>>;
  /** 是否自動聚焦輸入欄位 */
  autoFocus?: boolean;
  /** 自訂輸入欄位 ID，預設採用 useId 產生 */
  inputId?: string;
}

/**
 * RenameEntityDialog - 提供單欄位重新命名的共用彈窗
 *
 * 以 Radix Dialog 為基礎，統一處理輸入狀態、驗證與送出流程。
 */
export function RenameEntityDialog({
  open,
  onClose,
  defaultValue,
  title,
  description,
  label,
  placeholder,
  confirmLabel = "儲存",
  cancelLabel = "取消",
  confirmingLabel = "儲存中...",
  maxLength,
  validate,
  emptyErrorMessage,
  maxLengthErrorMessage,
  onSubmit,
  confirmButtonProps,
  cancelButtonProps,
  autoFocus = true,
  inputId,
}: RenameEntityDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const generatedId = useId();
  const fieldId = inputId ?? generatedId;

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setError(null);
      setIsSubmitting(false);
    }
  }, [defaultValue, open]);

  const runValidation = (input: string) => {
    if (validate) {
      return validate(input);
    }

    if (!input) {
      return emptyErrorMessage ?? "內容不可為空";
    }

    if (typeof maxLength === "number" && input.length > maxLength) {
      return maxLengthErrorMessage ?? `內容長度不可超過 ${maxLength} 字元`;
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedValue = value.trim();
    const validationError = runValidation(trimmedValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmedValue);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setValue(defaultValue);
    setError(null);
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    const trimmed = newValue.trim();
    if (!trimmed) {
      setError(null);
      return;
    }
    const validationError = runValidation(trimmed);
    setError(validationError);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor={fieldId}>{label}</Label>
              <Input
                id={fieldId}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={isSubmitting}
                autoFocus={autoFocus}
                className={`focus-visible:ring-[1px] ${
                  error
                    ? "focus-visible:ring-red-500 focus-visible:border-red-500 border-red-500"
                    : "focus-visible:ring-green-700 focus-visible:border-green-700"
                }`}
              />
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {typeof maxLength === "number" ? (
                <p className="text-xs text-gray-500">
                  {value.length} / {maxLength} 字元
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              {...cancelButtonProps}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              {...confirmButtonProps}
            >
              {isSubmitting ? confirmingLabel : confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
