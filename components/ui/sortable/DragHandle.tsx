import React from "react";
import { GripVerticalIcon } from "lucide-react";
import { DraggableSyntheticListeners } from "@dnd-kit/core";

interface DragHandleProps {
  listeners?: DraggableSyntheticListeners;
  className?: string;
}

export function DragHandle({ listeners, className = "" }: DragHandleProps) {
  return (
    <button
      {...listeners}
      className={`cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600 ${className}`}
      aria-label="Drag to reorder"
    >
      <GripVerticalIcon className="w-5 h-5" />
    </button>
  );
}

