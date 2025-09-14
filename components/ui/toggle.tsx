"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "rounded-lg transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-600 hover:text-black data-[state=on]:bg-green-700 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:pointer-events-none",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-center",
      },
      size: {
        default: "h-10 px-6 min-w-56",
        sm: "h-8 px-4 min-w-32",
        lg: "h-12 px-8 min-w-32",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
