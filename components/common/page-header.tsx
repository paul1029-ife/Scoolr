import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The one page header for the dashboard.
 *
 * Every page previously hand-rolled its own sticky bar, and each used
 * `text-md` — which is not a Tailwind class, so all of those titles silently
 * rendered at body size with no hierarchy at all.
 *
 * It stays stuck to the top while a long table scrolls, so the page's primary
 * action never scrolls out of reach.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur",
        "supports-[backdrop-filter]:bg-background/75",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

/** Standard horizontal rhythm and max width for dashboard page bodies. */
export function PageBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 py-5 sm:px-6 sm:py-6", className)}>{children}</div>
  );
}

/**
 * Toolbar above a table: search and filters left, actions right, wrapping to
 * stacked rows on a phone rather than overflowing.
 */
export function PageToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Consistent empty state for tables, lists and panels. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <span className="mb-3 flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
