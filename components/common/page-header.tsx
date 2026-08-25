import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

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
  backHref,
  backLabel = "Back",
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  /** Renders a back control before the title — used by the detail pages. */
  backHref?: string;
  backLabel?: string;
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
        <div className="flex min-w-0 items-center gap-1.5">
          {backHref && (
            <Link
              href={backHref}
              aria-label={backLabel}
              className="-ml-1.5 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
          )}
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

/**
 * A whole-screen notice, for the states rendered instead of the dashboard
 * shell — no sidebar, no header, nothing to navigate to.
 */
export function FullPageNotice({
  icon: Icon,
  tone = "neutral",
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  tone?: "neutral" | "warning";
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <span
          className={cn(
            "mx-auto mb-4 flex size-10 items-center justify-center rounded-full",
            tone === "warning"
              ? "bg-warning-subtle text-warning"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="size-5" />
        </span>
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

/**
 * The page a role is not allowed to open. Keeps the header so the section
 * still looks like part of the app rather than an error.
 */
export function RestrictedPage({
  title,
  heading,
  description,
}: {
  title: string;
  heading: string;
  description: string;
}) {
  return (
    <>
      <PageHeader title={title} />
      <PageBody>
        <div className="rounded-lg border border-dashed border-border">
          <EmptyState icon={Lock} title={heading} description={description} />
        </div>
      </PageBody>
    </>
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
