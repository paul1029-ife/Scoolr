import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Metrics read as one instrument panel rather than a row of floating tiles.
 *
 * The container paints the hairlines: a 1px gap over a `bg-border` backdrop
 * with each cell on `bg-card`. That gives exact separators however the grid
 * reflows, which `divide-x` cannot do once a grid wraps to two rows.
 */
export function MetricGroup({
  children,
  className,
  columns = 4,
}: {
  children: React.ReactNode;
  className?: string;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border",
        columns === 4 ? "lg:grid-cols-4" : "sm:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Metric({
  label,
  value,
  change,
  trending = true,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  /**
   * Period-over-period change. Omit when there is no comparison to make — the
   * indicator is hidden rather than showing an invented figure.
   */
  change?: string;
  trending?: boolean;
  hint?: string;
  className?: string;
}) {
  const TrendIcon = trending ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={cn("bg-card px-4 py-3.5 sm:px-5 sm:py-4", className)}>
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium tabular-nums",
              trending ? "text-success" : "text-destructive"
            )}
          >
            <TrendIcon className="size-3" />
            {change}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
