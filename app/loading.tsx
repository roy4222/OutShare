import { LoadingLogo } from "@/components/ui/loading/LoadingLogo";

export default function Loading() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <LoadingLogo />
    </div>
  );
}

