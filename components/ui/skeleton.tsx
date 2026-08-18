import { cn } from "@/lib/utils"

/**
 * A sweeping highlight rather than a pulsing block: at rest it reads as a
 * placeholder shape, and the sweep signals "loading" without the whole page
 * throbbing in and out.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
        "after:bg-gradient-to-r after:from-transparent after:via-black/[0.045] after:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
