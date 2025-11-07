"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Equipment } from "@/lib/types/equipment";
import { SquarePenIcon, TrashIcon } from "lucide-react";

export interface EquipmentWithId extends Equipment {
  id: string;
}

interface EquipmentColumnsOptions {
  onEdit?: (equipment: EquipmentWithId) => void;
  onDelete?: (equipment: EquipmentWithId) => void;
}

export function createEquipmentColumns(
  options: EquipmentColumnsOptions = {}
): ColumnDef<EquipmentWithId>[] {
  const { onEdit, onDelete } = options;

  return [
    {
      accessorKey: "name",
      header: "名稱",
      cell: ({ row }) => {
        const name = row.original.name;
        const brand = row.original.brand;

        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{name}</span>
            {brand && <span className="text-sm text-gray-500">{brand}</span>}
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "weight",
      header: "重量 / 價格",
      cell: ({ row }) => {
        const weight = row.original.weight;
        const price = row.original.price;

        const parts = [];
        if (weight) {
          parts.push(`${weight.toLocaleString()} 克`);
        }
        if (price) {
          parts.push(`${price.toLocaleString()} 元`);
        }

        return (
          <div className="text-gray-700">
            {parts.length > 0 ? parts.join(" / ") : "–"}
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "tags",
      header: "標籤",
      cell: ({ row }) => {
        const tags = row.original.tags || [];

        return (
          <div className="flex flex-wrap gap-1">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-gray-400">–</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "buy_link",
      header: "連結名稱",
      cell: ({ row }) => {
        const buyLink = row.original.buy_link;
        const linkName = row.original.link_name;

        if (!buyLink) {
          return <span className="text-gray-400">–</span>;
        }

        return (
          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-800 hover:underline"
          >
            {linkName || "查看連結"}
          </a>
        );
      },
      size: 150,
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(row.original)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="編輯裝備"
              >
                <SquarePenIcon className="size-5 text-green-700" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(row.original)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="刪除裝備"
              >
                <TrashIcon className="size-5 text-red-600" />
              </button>
            )}
          </div>
        );
      },
      size: 100,
    },
  ];
}
