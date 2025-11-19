import { Skeleton, SkeletonAvatar, SkeletonCard } from "@/components/ui/loading/LoadingSkeleton";

export default function ProfileLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      {/* 個人資料區塊 Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <SkeletonAvatar className="h-20 w-20" /> {/* Assuming larger avatar for profile */}
            <Skeleton className="h-8 w-48 mt-4" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
      </div>

      {/* 裝備展示區塊 Skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

