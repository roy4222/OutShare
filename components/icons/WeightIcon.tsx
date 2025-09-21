import { cn } from "@/lib/utils";

interface WeightIconProps {
  className?: string;
}

export const WeightIcon = ({ className }: WeightIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 24 24"
      className={cn("size-4 text-green-700", className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M9 6a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
        <path d="M6.835 9h10.33a1 1 0 0 1 .984.821l1.637 9A1 1 0 0 1 18.802 20H5.198a1 1 0 0 1-.984-1.179l1.637-9A1 1 0 0 1 6.835 9" />
      </g>
    </svg>
  );
};
