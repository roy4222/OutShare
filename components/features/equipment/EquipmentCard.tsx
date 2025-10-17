/**
 * EquipmentCard 組件（重構版）
 * 
 * 純展示組件，顯示單個裝備的詳細資訊
 */

import Image from "next/image";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLinkIcon } from "@/asset/icons/ExternalLinkIcon";
import { WeightIcon } from "@/asset/icons/WeightIcon";
import { PriceIcon } from "@/asset/icons/PriceIcon";
import { EquipmentCardProps } from "@/lib/types/equipment";

const EquipmentCard = ({ equipment, className }: EquipmentCardProps) => {
  return (
    <AccordionItem
      value={equipment.name}
      className={`rounded-lg bg-white mb-2 relative ${className || ''}`}
    >
      {/* 手風琴觸發器 */}
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center w-full gap-4">
          {/* 裝備圖片 */}
          {equipment.image && (
            <div className="flex-shrink-0">
              <Image
                src={equipment.image}
                alt={equipment.name}
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
            </div>
          )}

          {/* 裝備基本資訊 */}
          <div className="flex-1 text-left">
            <div className="flex items-center">
              {/* 裝備名稱 */}
              <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                {equipment.name}
              </h4>

              {/* 購買連結 */}
              {equipment.buy_link && (
                <a
                  href={equipment.buy_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-1 md:px-2 rounded-full bg-white hover:text-green-200"
                  title="購買商品"
                  onClick={(e) => e.stopPropagation()} // 防止觸發 Accordion
                >
                  <ExternalLinkIcon />
                </a>
              )}
            </div>

            {/* 品牌名稱 */}
            <p className="text-gray-600 text-sm md:text-base">
              {equipment.brand}
            </p>
          </div>
        </div>
      </AccordionTrigger>

      {/* 手風琴內容 - 詳細資訊 */}
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3">
          {/* 規格資訊 */}
          <div className="space-y-2 gap-3">
            {/* 重量 */}
            <div className="flex items-center gap-2">
              <WeightIcon />
              <span>{equipment.weight.toLocaleString()} 公克</span>
            </div>

            {/* 價格 */}
            <div className="flex items-center gap-2">
              <PriceIcon />
              <span>{equipment.price.toLocaleString()} 元</span>
            </div>
          </div>

          {/* 標籤 */}
          {equipment.tags && equipment.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {equipment.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-sm text-green-800 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default EquipmentCard;

