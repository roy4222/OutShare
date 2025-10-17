/**
 * EquipmentGroup 組件
 * 
 * 顯示單個分類的裝備群組
 */

import { Accordion } from "@/components/ui/accordion";
import { Equipment } from "@/lib/types/equipment";
import EquipmentCard from "./EquipmentCard";

interface EquipmentGroupProps {
  category: string;
  equipment: Equipment[];
  className?: string;
}

const EquipmentGroup = ({ category, equipment, className }: EquipmentGroupProps) => {
  if (equipment.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {/* 分類標題 */}
      <h3 className="text-lg font-bold text-gray-800 border-b-2 border-green-700 pb-2 text-left">
        {category}
      </h3>

      {/* 該分類下的裝備清單 */}
      <Accordion type="single" collapsible>
        {equipment.map((item) => (
          <EquipmentCard key={item.name} equipment={item} />
        ))}
      </Accordion>
    </div>
  );
};

export default EquipmentGroup;

