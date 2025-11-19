"use client";

import React, { createContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DraggableSyntheticListeners } from "@dnd-kit/core";

// Context to pass listeners to child cells (like DragHandleCell)
export const SortableRowContext = createContext<{
  listeners: DraggableSyntheticListeners;
} | null>(null);

interface SortableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  id: string;
}

export function SortableRow({ id, children, className, ...props }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 10 : 1,
    willChange: isDragging ? "transform" : "auto",
  };

  return (
    <SortableRowContext.Provider value={{ listeners }}>
      <tr
        ref={setNodeRef}
        style={style}
        className={`${className || ""} ${isDragging ? "bg-gray-50" : ""}`}
        {...props}
        // We expose data-sortable-id for potentially finding context if needed
        data-sortable-id={id}
      >
        {children}
      </tr>
    </SortableRowContext.Provider>
  );
}
