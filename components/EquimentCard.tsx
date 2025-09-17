import { equipmentData } from "@/data/equiment";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

interface EquimentCardProps {
  tripTitle?: string; // 可選的旅程標題，用於過濾裝備
}

/**
 * 裝備卡片組件
 * 
 * 用於顯示所有裝備的清單，按照 category 分類並採用手風琴式設計：
 * - 收合狀態：顯示裝備圖片、名稱、品牌、價格
 * - 展開狀態：顯示詳細資訊（重量、價格、標籤）
 * 
 * 功能特色：
 * - 按照裝備類別分組顯示（睡眠系統、背負系統、電子配備等）
 * - 使用 Accordion 組件提供互動式展開/收合功能
 * - 每個裝備項目都有獨立的觸發區域
 * - 支援標籤顯示，方便分類和篩選
 * - 可根據旅程標題過濾相關裝備
 * 
 * @param tripTitle - 可選的旅程標題，如果提供則只顯示與該旅程相關的裝備
 * @returns JSX.Element - 渲染按類別分組的裝備清單手風琴組件
 */
const EquimentCard = ({ tripTitle }: EquimentCardProps) => {
  // 根據旅程標題過濾裝備資料（如果有提供 tripTitle）
  const filteredEquipment = tripTitle 
    ? equipmentData.filter(equipment => 
        equipment.trips && equipment.trips.includes(tripTitle)
      )
    : equipmentData;

  // 將過濾後的裝備資料按照 category 分組
  const groupedEquipment = filteredEquipment.reduce((groups, equipment) => {
    const category = equipment.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(equipment);
    return groups;
  }, {} as Record<string, typeof equipmentData>);

  return (
    <div className="space-y-6">
      {/* 遍歷每個分類群組 */}
      {Object.entries(groupedEquipment).map(([category, equipmentList]) => (
        <div key={category} className="space-y-3">
          {/* 分類標題 */}
          <h3 className="text-xl font-bold text-gray-800 border-b-2 border-green-700 pb-2 text-left">
            {category}
          </h3>
          
          {/* 該分類下的裝備清單 */}
          <Accordion type="single" collapsible>
            {equipmentList.map((equipment, index) => (
              <AccordionItem 
                key={equipment.name} 
                value={`${category}-${index}`} 
                className="rounded-lg bg-white mb-2"
              >
                {/* 手風琴觸發器 - 點擊此區域可展開/收合內容 */}
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center w-full gap-4">
                    {/* 裝備圖片區域 */}
                    <div className="flex-shrink-0">
                      <Image
                        src={equipment.image || ""}  // 裝備圖片路徑，如果沒有則使用空字串
                        alt={equipment.name}         // 圖片替代文字，使用裝備名稱
                        width={48}                   // 圖片寬度 48px
                        height={48}                  // 圖片高度 48px
                        className="rounded-md object-cover"  // 圓角樣式並保持圖片比例
                      />
                    </div>
                    {/* 裝備基本資訊區域 */}
                    <div className="flex-1 text-left">
                      {/* 裝備名稱 */}
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {equipment.name}
                      </h4>
                      {/* 品牌名稱 - 使用紫色突出顯示 */}
                      <p className="text-gray-600 font-medium text-sm">
                        {equipment.brand}
                      </p>
                    </div>
                    {/* 價格顯示區域 - 靠右對齊 */}
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-600">{equipment.price} NTD</span>
                    </div>
                  </div>
                </AccordionTrigger>
                {/* 手風琴內容區域 - 展開時顯示的詳細資訊 */}
                <AccordionContent className="px-4 pb-4">
                  <div className="pt-2 space-y-3">
                    {/* 詳細規格資訊 - 重量和價格 */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">重量: {equipment.weight}</span>
                      <span className="font-medium">價格: {equipment.price} NTD</span>
                    </div>
                    {/* 標籤區域 - 只有當裝備有標籤時才顯示 */}
                    {equipment.tags && equipment.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {/* 遍歷裝備標籤陣列，為每個標籤建立一個 Badge 組件 */}
                        {equipment.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="default" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default EquimentCard;
