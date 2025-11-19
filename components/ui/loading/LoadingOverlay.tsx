"use client";

import React from "react";
import { LoadingLogo } from "./LoadingLogo";
import { cn } from "@/lib/utils";
import { BRAND_COLORS } from "./constants";

interface LoadingOverlayProps {
  className?: string;
  message?: string;
  isLoading?: boolean;
}

export const LoadingOverlay = ({ 
  className, 
  message, 
  isLoading = true 
}: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300",
        className
      )}
      style={{ backgroundColor: `${BRAND_COLORS.grey100}E6` }} // 90% opacity
    >
      <LoadingLogo text={message} />
    </div>
  );
};

