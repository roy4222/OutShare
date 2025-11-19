/**
 * EquipmentList 組件（重構版）
 * 
 * 顯示裝備列表，按分類分組
 * 使用 useEquipment hook 處理資料邏輯
 */

"use client";

import { EquipmentListProps } from "@/lib/types/equipment";
import { useEquipment } from "@/lib/hooks/useEquipment";
import EquipmentGroup from "./EquipmentGroup";
import { EquipmentListSkeleton } from "@/components/ui/loading/SkeletonVariants";
import { cn } from "@/lib/utils";

const EquipmentList = ({ userId, tripTitle, tripId, className }: EquipmentListProps) => {
  const { groupedEquipment, isEmpty, isLoading, error } = useEquipment({
    userId,
    tripTitle,
    tripId,
    groupByCategory: true,
  });

  if (isLoading) {
    return <EquipmentListSkeleton count={3} />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        載入失敗: {error.message}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center text-gray-500 py-8">
        沒有找到相關裝備
      </div>
    );
  }

  if (!groupedEquipment) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(groupedEquipment).map(([category, equipmentList]) => (
        <EquipmentGroup
          key={category}
          category={category}
          equipment={equipmentList}
        />
      ))}
    </div>
  );
};

export default EquipmentList;

