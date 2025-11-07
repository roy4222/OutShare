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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

const EQUIPMENT_NAME_MAX_LENGTH = 50;
const BRAND_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 80;
const LINK_NAME_MAX_LENGTH = 20;

interface EquipmentFormDialogProps {
  /** 彈窗開啟狀態 */
  open: boolean;
  /** 關閉彈窗的回調函數 */
  onClose: () => void;
  /** 預設類別（從「新增類別」流程傳入） */
  defaultCategory?: string;
  /** 提交表單的回調函數 */
  onSubmit: (formData: EquipmentFormData) => Promise<void>;
}

export interface EquipmentFormData {
  name: string;
  brand?: string;
  description?: string;
  weight?: number;
  price?: number;
  tags?: string[];
  buy_link?: string;
  link_name?: string;
  category: string;
  image_url?: string;
}

/**
 * EquipmentFormDialog - 裝備表單對話框
 *
 * 提供新增/編輯裝備的表單界面
 */
export function EquipmentFormDialog({
  open,
  onClose,
  defaultCategory = "",
  onSubmit,
}: EquipmentFormDialogProps) {
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: "",
    brand: "",
    description: "",
    weight: undefined,
    price: undefined,
    tags: [],
    buy_link: "",
    link_name: "",
    category: defaultCategory,
    image_url: "",
  });

  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 當 dialog 開啟時，重置表單並設定預設類別
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        brand: "",
        description: "",
        weight: undefined,
        price: undefined,
        tags: [],
        buy_link: "",
        link_name: "",
        category: defaultCategory,
        image_url: "",
      });
      setTagsInput("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open, defaultCategory]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "裝備名稱為必填欄位";
    }
    if (formData.name.length > EQUIPMENT_NAME_MAX_LENGTH) {
      return `裝備名稱不可超過 ${EQUIPMENT_NAME_MAX_LENGTH} 字元`;
    }
    if (formData.brand && formData.brand.length > BRAND_MAX_LENGTH) {
      return `品牌名稱不可超過 ${BRAND_MAX_LENGTH} 字元`;
    }
    if (formData.description && formData.description.length > DESCRIPTION_MAX_LENGTH) {
      return `裝備說明不可超過 ${DESCRIPTION_MAX_LENGTH} 字元`;
    }
    if (formData.link_name && formData.link_name.length > LINK_NAME_MAX_LENGTH) {
      return `連結名稱不可超過 ${LINK_NAME_MAX_LENGTH} 字元`;
    }
    if (!formData.category.trim()) {
      return "類別為必填欄位";
    }
    // 驗證 URL 格式（如果有填寫）
    if (formData.buy_link && formData.buy_link.trim()) {
      try {
        new URL(formData.buy_link);
      } catch {
        return "連結格式不正確，請輸入有效的 URL（如 https://example.com）";
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 處理標籤：將逗號分隔的字串轉換為陣列
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // 清理資料：空值轉為 undefined
      const cleanedData: EquipmentFormData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        brand: formData.brand?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        weight: formData.weight || undefined,
        price: formData.price || undefined,
        tags: tags.length > 0 ? tags : undefined,
        buy_link: formData.buy_link?.trim() || undefined,
        link_name: formData.link_name?.trim() || undefined,
        image_url: undefined, // 圖片功能暫不實作
      };

      await onSubmit(cleanedData);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      brand: "",
      description: "",
      weight: undefined,
      price: undefined,
      tags: [],
      buy_link: "",
      link_name: "",
      category: defaultCategory,
      image_url: "",
    });
    setTagsInput("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>裝備資訊</DialogTitle>
            <DialogDescription>
              填寫裝備的詳細資訊，標記為 * 的欄位為必填。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* 圖片上傳區域（暫不實作，UI 僅顯示） */}
            <div className="grid gap-2">
              <Label>新增裝備圖片</Label>
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 opacity-50 cursor-not-allowed">
                <div className="text-center">
                  <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    點擊新增圖片（功能開發中）
                  </p>
                  <p className="text-xs text-gray-400">支援格式：支援 JPG / PNG，最大 2MB</p>
                </div>
              </div>
            </div>

            {/* 裝備名稱 */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                裝備名稱 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="請輸入裝備名稱"
                maxLength={EQUIPMENT_NAME_MAX_LENGTH}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* 品牌名稱 */}
            <div className="grid gap-2">
              <Label htmlFor="brand">品牌名稱</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="請輸入品牌名稱"
                maxLength={BRAND_MAX_LENGTH}
                disabled={isSubmitting}
              />
            </div>

            {/* 裝備說明 */}
            <div className="grid gap-2">
              <Label htmlFor="description">裝備說明</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="請輸入說明"
                maxLength={DESCRIPTION_MAX_LENGTH}
                disabled={isSubmitting}
                className="min-h-20"
              />
              <p className="text-xs text-gray-500">
                最多 {DESCRIPTION_MAX_LENGTH} 字元
              </p>
            </div>

            {/* 重量和價格（並排） */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">重量</Label>
                <div className="relative">
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight ?? ""}
                    onChange={handleNumberChange}
                    placeholder="請輸入重量"
                    disabled={isSubmitting}
                    min="0"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    克
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">價格</Label>
                <div className="relative">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price ?? ""}
                    onChange={handleNumberChange}
                    placeholder="請輸入價格"
                    disabled={isSubmitting}
                    min="0"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    元
                  </span>
                </div>
              </div>
            </div>

            {/* 標籤 */}
            <div className="grid gap-2">
              <Label htmlFor="tags">標籤</Label>
              <Input
                id="tags"
                name="tags"
                value={tagsInput}
                onChange={handleTagsChange}
                placeholder="請輸入標籤"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">以逗號分隔多個標籤</p>
            </div>

            {/* 連結 */}
            <div className="grid gap-2">
              <Label htmlFor="buy_link">連結</Label>
              <Input
                id="buy_link"
                name="buy_link"
                type="url"
                value={formData.buy_link}
                onChange={handleInputChange}
                placeholder="請輸入連結 https://"
                disabled={isSubmitting}
              />
            </div>

            {/* 連結名稱 */}
            <div className="grid gap-2">
              <Label htmlFor="link_name">連結名稱</Label>
              <Input
                id="link_name"
                name="link_name"
                value={formData.link_name}
                onChange={handleInputChange}
                placeholder="請輸入連結名稱"
                maxLength={LINK_NAME_MAX_LENGTH}
                disabled={isSubmitting}
              />
            </div>

            {/* 類別 */}
            <div className="grid gap-2">
              <Label htmlFor="category">
                類別 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="請輸入類別"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              {isSubmitting ? "儲存中..." : "儲存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
