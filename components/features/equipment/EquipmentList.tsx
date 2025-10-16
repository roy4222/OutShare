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

const EquipmentList = ({ tripTitle, className }: EquipmentListProps) => {
  const { groupedEquipment, isEmpty } = useEquipment({
    tripTitle,
    groupByCategory: true,
  });

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
    <div className={`space-y-6 ${className || ''}`}>
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

