import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Status, not decoration. Rounded-md rather than a pill, medium rather than
 * semibold weight, and the status variants use the `-subtle` background tokens
 * so callers stop hand-picking `bg-green-100 text-green-700`.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium leading-4 transition-colors [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border text-muted-foreground",
        success: "border-success/20 bg-success-subtle text-success",
        warning: "border-warning/20 bg-warning-subtle text-warning",
        destructive:
          "border-destructive/20 bg-destructive-subtle text-destructive",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Renders a small leading dot — reads faster than colour alone in a table. */
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
