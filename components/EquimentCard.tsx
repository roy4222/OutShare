import { equipmentData } from "@/data/equiment";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

const EquimentCard = () => {
  return (
    <Accordion type="single" collapsible>
      {equipmentData.map((equipment, index) => (
        <AccordionItem key={equipment.name} value={`item-${index}`} className="border rounded-lg bg-gray-50">
          <AccordionTrigger className="px-4 py-3 hover:no-underline ">
            <div className="w-full">
              <div className="flex-shrink-0">
                <Image
                  src={equipment.image || ""}
                  alt={equipment.name}
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {equipment.name}
                </h4>
                <p className="text-purple-600 font-medium text-sm">
                  {equipment.brand}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-600">{equipment.price} NTD</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">重量: {equipment.weight}</span>
                <span className="font-medium">價格: {equipment.price} NTD</span>
              </div>
              {equipment.tags && (
                <div className="flex gap-1 flex-wrap">
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
  );
};

export default EquimentCard;
