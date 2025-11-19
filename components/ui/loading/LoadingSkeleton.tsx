"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-grey-300", className)}
      {...props}
    />
  );
};

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col space-y-3", className)}>
    <Skeleton className="h-[125px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

export const SkeletonRow = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center space-x-4", className)}>
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

export const SkeletonAvatar = ({ className }: { className?: string }) => (
  <Skeleton className={cn("h-10 w-10 rounded-full", className)} />
);

