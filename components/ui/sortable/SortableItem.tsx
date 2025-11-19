"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  children: (props: {
    attributes: any;
    listeners: any;
    isDragging: boolean;
    dragHandleProps: any;
  }) => React.ReactNode;
  className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : "all 200ms cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition for sorting, none for dragging
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    willChange: isDragging ? "transform" : "auto", // GPU optimization
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children({
        attributes,
        listeners,
        isDragging,
        dragHandleProps: { ...attributes, ...listeners },
      })}
    </div>
  );
}

