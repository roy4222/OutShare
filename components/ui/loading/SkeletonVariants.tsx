/**
 * Skeleton 變體元件
 * 
 * 提供常用的 Skeleton 佈局模式，避免重複程式碼
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./LoadingSkeleton";

/**
 * 裝備類別 Skeleton
 * 用於 GearDashboard 和 EquipmentList
 */
export const EquipmentCategorySkeleton = ({ className }: { className?: string }) => (
  <div className={cn("space-y-3 rounded-lg border border-grey-400 bg-white p-4", className)}>
    <Skeleton className="h-5 w-32" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

/**
 * 裝備列表 Skeleton（多個類別）
 */
export const EquipmentListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <EquipmentCategorySkeleton key={index} />
    ))}
  </div>
);

/**
 * Gear Dashboard 完整 Skeleton
 * 包含標題、按鈕和多個類別
 */
export const GearDashboardSkeleton = () => (
  <div className="space-y-6">
    {/* 標題列 */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-28" />
    </div>
    
    {/* 類別列表 */}
    <EquipmentListSkeleton count={3} />
  </div>
);

