import { cn } from "@/lib/utils";

interface ExternalLinkIconProps {
  className?: string;
}

export const ExternalLinkIcon = ({ className }: ExternalLinkIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 24 24"
      className={cn("size-4 text-green-700", className)}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M11 4H4v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M9 15L20 4m-5 0h5v5"
      />
    </svg>
  );
};
