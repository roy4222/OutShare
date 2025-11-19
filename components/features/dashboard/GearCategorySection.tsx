"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  createEquipmentColumns,
  EquipmentWithId,
} from "./equipment-columns";
import { Button } from "@/components/ui/button";
import { SquarePenIcon, TrashIcon } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/ui/sortable/SortableItem";
import { DragHandle } from "@/components/ui/sortable/DragHandle";
import { SortableRow } from "@/components/ui/sortable/SortableRow";

interface GearCategorySectionProps {
  /** 類別 ID */
  id: string;
  /** 類別名稱 */
  category: string;
  /** 該類別下的裝備列表 */
  equipment: EquipmentWithId[];
  /** 新增裝備的回調 */
  onAddEquipment: (category: string) => void;
  /** 編輯類別名稱的回調 */
  onEditCategory?: (category: string) => void;
  /** 刪除類別的回調 */
  onDeleteCategory?: (category: string) => void;
  /** 編輯裝備的回調 */
  onEditEquipment?: (equipment: EquipmentWithId) => void;
  /** 刪除裝備的回調 */
  onDeleteEquipment?: (equipment: EquipmentWithId) => void;
}

/**
 * GearCategorySection - 單一裝備類別區域 (Sortable)
 *
 * 展示一個可排序的類別區塊，包含：
 * 1. 可拖曳的類別標題
 * 2. 可拖曳的裝備列表 (SortableContext + DataTable with SortableRow)
 */
export function GearCategorySection({
  id,
  category,
  equipment,
  onAddEquipment,
  onEditCategory,
  onDeleteCategory,
  onEditEquipment,
  onDeleteEquipment,
}: GearCategorySectionProps) {
  const columns = createEquipmentColumns({
    onEdit: onEditEquipment,
    onDelete: onDeleteEquipment,
  });

  return (
    <SortableItem id={id} className="mb-6">
      {({ dragHandleProps, isDragging }) => (
        <div
          className={`border border-gray-200 rounded-lg bg-white shadow-sm transition-shadow ${
            isDragging ? "shadow-xl ring-2 ring-green-500/20" : ""
          }`}
        >
          {/* 類別標題區域 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              {/* Category Drag Handle */}
              <DragHandle listeners={dragHandleProps} />
              
              <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
              {onEditCategory && (
                <button
                  onClick={() => onEditCategory(category)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label="編輯類別"
                >
                  <SquarePenIcon className="size-4 text-green-700" />
                </button>
              )}
              {onDeleteCategory && (
                <button
                  onClick={() => onDeleteCategory(category)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label="刪除類別"
                >
                  <TrashIcon className="size-4 text-red-600" />
                </button>
              )}
            </div>

            <Button
              onClick={() => onAddEquipment(category)}
              className="bg-green-700 hover:bg-green-800 text-white"
              size="sm"
            >
              + 新增裝備
            </Button>
          </div>

          {/* 裝備列表（Sortable Data Table） */}
          <div className="p-6">
            <SortableContext
              items={equipment.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              <DataTable 
                columns={columns} 
                data={equipment} 
                // Pass custom row component to DataTable to enable sorting
                customRowComponent={SortableRow}
              />
            </SortableContext>
          </div>
        </div>
      )}
    </SortableItem>
  );
}
