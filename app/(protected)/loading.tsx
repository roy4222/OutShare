import { LoadingLogo } from "@/components/ui/loading/LoadingLogo";

export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
      <LoadingLogo text="準備您的冒險..." />
    </div>
  );
}

