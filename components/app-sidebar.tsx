"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Contact,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeft,
  PanelLeftClose,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";
import { usePermissions } from "@/components/auth/permissions-provider";
import type { Permission } from "@/lib/auth/permissions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** The signed-in user, resolved server-side in the dashboard layout. */
export interface SidebarUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AppSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  user: SidebarUser;
  children: React.ReactNode;
}

/** Nav entries carry an optional permission so the menu matches what a role can reach. */
type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  exact?: boolean;
  permission?: Permission;
};

// Icons now describe what they link to — Students was a shirt, Subjects a
// disc, and Teachers a pen, none of which read as their section at a glance.
const primaryNavigation: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Students", url: "/dashboard/students", icon: GraduationCap },
  { title: "Teachers", url: "/dashboard/teachers", icon: Users },
  { title: "Subjects", url: "/dashboard/subjects", icon: BookOpen },
  { title: "Guardians", url: "/dashboard/guardians", icon: Contact },
];

const secondaryNavigation: NavItem[] = [
  {
    title: "Billing",
    url: "/dashboard/billings",
    icon: CreditCard,
    // Hidden from teachers, whose accounts cannot open the billing page.
    permission: "billing:view",
  },
  { title: "Events", url: "/dashboard/events", icon: CalendarDays },
  { title: "Staff", url: "/dashboard/staff", icon: ShieldCheck, permission: "school:manage" },
  { title: "Import", url: "/dashboard/import", icon: Upload, permission: "school:manage" },
];

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="currentColor" />
        </svg>
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight">Scoolr</span>
      )}
    </span>
  );
}

function NavLink({
  item,
  isActive,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.url}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex h-8 items-center gap-2.5 rounded-md text-sm",
        "transition-colors duration-100",
        collapsed ? "w-8 justify-center" : "px-2.5",
        isActive
          ? "bg-foreground/[0.06] font-medium text-foreground"
          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground"
        )}
      />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
      {children}
    </div>
  );
}

export function AppSidebar({
  isCollapsed,
  setIsCollapsed,
  user,
  children,
}: AppSidebarProps) {
  const pathname = usePathname();
  const permissions = usePermissions();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Only show what this role can actually open.
  const visible = (items: NavItem[]) =>
    items.filter((item) => !item.permission || permissions.has(item.permission));

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.url : pathname.startsWith(item.url);

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email;
  const initials =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || user.email[0]?.toUpperCase();
  // "SUPER_ADMIN" -> "Super admin"
  const roleLabel =
    user.role.charAt(0) + user.role.slice(1).toLowerCase().replace(/_/g, " ");

  const signOut = async () => {
    await authClient.signOut();
    // Full document load so no cached authenticated RSC payload survives.
    // router.push() would keep the client cache, briefly showing the signed-in
    // UI to someone who has just signed out, so the rule is knowingly ignored.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/");
  };

  /** Shared by the fixed desktop rail and the mobile sheet. */
  const navSections = (collapsed: boolean, onNavigate?: () => void) => (
    <>
      <nav className="flex flex-col gap-0.5">
        {visible(primaryNavigation).map((item) => (
          <NavLink
            key={item.title}
            item={item}
            isActive={isActive(item)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {visible(secondaryNavigation).length > 0 && (
        <>
          {collapsed ? (
            <div className="my-3 h-px bg-border" />
          ) : (
            <SectionLabel>Administration</SectionLabel>
          )}
          <nav className="flex flex-col gap-0.5">
            {visible(secondaryNavigation).map((item) => (
              <NavLink
                key={item.title}
                item={item}
                isActive={isActive(item)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </>
      )}
    </>
  );

  const userBlock = (collapsed: boolean) => (
    <div
      className={cn(
        "flex items-center gap-2.5 border-t border-border p-3",
        collapsed && "justify-center px-2"
      )}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
        {initials}
      </span>
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13px] font-medium">{displayName}</span>
            <span className="block truncate text-xs text-muted-foreground">{roleLabel}</span>
          </span>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={signOut} aria-label="Sign out">
                <LogOut />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Sign out</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-canvas">
        {/* Desktop rail ------------------------------------------------- */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden lg:flex lg:flex-col",
            "border-r border-border bg-canvas",
            "transition-[width] duration-200 ease-out",
            isCollapsed ? "w-[57px]" : "w-60"
          )}
        >
          <div
            className={cn(
              "flex h-14 shrink-0 items-center border-b border-border",
              isCollapsed ? "justify-center px-2" : "justify-between px-3"
            )}
          >
            <Link href="/dashboard" className="rounded-md">
              <Wordmark compact={isCollapsed} />
            </Link>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {isCollapsed && (
              <div className="mb-2 flex justify-center">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsCollapsed(false)}
                  aria-label="Expand sidebar"
                >
                  <PanelLeft />
                </Button>
              </div>
            )}
            {navSections(isCollapsed)}
          </div>

          {userBlock(isCollapsed)}
        </aside>

        {/* Mobile top bar ------------------------------------------------
            The old layout had none: the sidebar was `fixed` and the content
            kept a 16rem left margin at every width, so on a phone the nav sat
            on top of the page. */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-canvas/95 px-3 backdrop-blur lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            {/* flex column so the user block sits at the bottom of the sheet
                rather than floating directly under the last nav item. */}
            <SheetContent
              side="left"
              className="flex w-[17rem] flex-col gap-0 p-0"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
                <Wordmark />
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-3">
                {navSections(false, () => setMobileOpen(false))}
              </div>
              {userBlock(false)}
            </SheetContent>
          </Sheet>
          <Link href="/dashboard">
            <Wordmark />
          </Link>
        </header>

        <main
          className={cn(
            "min-h-screen bg-background",
            "transition-[padding] duration-200 ease-out",
            "lg:min-h-screen lg:border-l-0",
            isCollapsed ? "lg:pl-[57px]" : "lg:pl-60"
          )}
        >
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}

export default AppSidebar;
