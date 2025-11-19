"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BRAND_COLORS } from "./constants";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export const LoadingSpinner = ({ 
  className, 
  size = "md",
  color
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid",
        sizeClasses[size],
        className
      )}
      style={{
        borderColor: BRAND_COLORS.grey200,
        borderTopColor: color ?? BRAND_COLORS.green800,
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

