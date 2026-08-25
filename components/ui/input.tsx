import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm",
          "transition-[border-color,box-shadow] duration-150",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground/70",
          "hover:border-border-strong",
          // The ring sits inside the field rather than offset from it, so a
          // focused input in a dense toolbar does not shove its neighbours.
          "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/25",
          // iOS zooms any field under 16px on focus; only relax below `sm`.
          "max-sm:text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
