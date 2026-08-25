"use client";

import type React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const WIDTHS = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
} as const;

interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Rendered as the drawer's trigger; omit when opening it from elsewhere. */
  trigger?: React.ReactNode;
  width?: keyof typeof WIDTHS;
  children: React.ReactNode;
}

/**
 * Right-hand drawer used for every create/edit form in the dashboard.
 *
 * Replaces the centred dialogs: a fixed, centred panel is fragile inside the
 * offset dashboard shell and cramped on small screens, whereas the drawer is
 * anchored to the viewport edge and full height at any size.
 */
export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  width = "md",
  children,
}: FormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="right"
        // p-0 so the header, scroll area and footer can own their own padding.
        className={cn("flex w-full flex-col gap-0 p-0", WIDTHS[width])}
      >
        <SheetHeader className="shrink-0 space-y-1 border-b px-6 py-4 text-left">
          <SheetTitle className="text-[15px] font-semibold tracking-tight text-foreground">
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className="text-[13px] text-muted-foreground">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* min-h-0 lets the child scroll instead of stretching the flex parent. */}
        <div className="min-h-0 flex-1">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

/** Scrollable body + pinned footer, for forms that live inside a FormDrawer. */
export function DrawerForm({
  onSubmit,
  children,
  footer,
}: {
  onSubmit: (event: React.FormEvent) => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
      <div className="shrink-0 border-t bg-white px-6 py-4">
        <div className="flex justify-end gap-2">{footer}</div>
      </div>
    </form>
  );
}

export default FormDrawer;
