"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Disc,
  Home,
  LogOut,
  PenSquare,
  Settings,
  ShieldCheck,
  Shirt,
  Timer,
  Upload,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";
import { usePermissions } from "@/components/auth/permissions-provider";
import type { Permission } from "@/lib/auth/permissions";

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

const primaryNavigation: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    exact: true,
  },
  {
    title: "Subjects",
    url: "/dashboard/subjects",
    icon: <Disc className="h-5 w-5" />,
  },
  {
    title: "Students",
    url: "/dashboard/students",
    icon: <Shirt className="h-5 w-5" />,
  },
  {
    title: "Teachers",
    url: "/dashboard/teachers",
    icon: <PenSquare className="h-5 w-5" />,
  },
  {
    title: "Guardians",
    url: "/dashboard/guardians",
    icon: <Users className="h-5 w-5" />,
  },
];

const secondaryNavigation: NavItem[] = [
  {
    title: "Billing",
    url: "/dashboard/billings",
    icon: <CreditCard className="h-5 w-5" />,
    // Hidden from teachers, whose accounts cannot open the billing page.
    permission: "billing:view",
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: <Timer className="h-5 w-5" />,
  },
  {
    title: "Staff",
    url: "/dashboard/staff",
    icon: <ShieldCheck className="h-5 w-5" />,
    permission: "school:manage",
  },
  {
    title: "Import",
    url: "/dashboard/import",
    icon: <Upload className="h-5 w-5" />,
    permission: "school:manage",
  },
];

/** Nav entries carry an optional permission so the menu matches what a role can reach. */
type NavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  exact?: boolean;
  badge?: string;
  permission?: Permission;
};

export function AppSidebar({
  isCollapsed,
  setIsCollapsed,
  user,
  children,
}: AppSidebarProps) {
  const pathname = usePathname();
  const permissions = usePermissions();

  // Only show what this role can actually open.
  const visible = (items: NavItem[]) =>
    items.filter(
      (item) => !item.permission || permissions.has(item.permission)
    );

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email;
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
    window.location.assign("/");
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50",
          "flex flex-col transition-all duration-200 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-blue-600 p-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
                </svg>
              </div>
              <h1 className="font-semibold text-lg">Scoolr</h1>
            </div>
          ) : (
            <div className="mx-auto rounded-md bg-blue-600 p-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
              </svg>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className="text-gray-600 bg-gray-50 border-2 hover:text-gray-700 rounded-md focus:outline-none "
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight className="h-5 w-5" />
            ) : (
              <ChevronsLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-hidden py-4">
          {!isCollapsed && (
            <div className="mb-2 px-4 text-xs font-semibold uppercase text-gray-500">
              Main
            </div>
          )}

          <nav>
            {visible(primaryNavigation).map((item) => {
              const isActive = item.exact
                ? pathname === item.url
                : pathname.startsWith(item.url);
              return (
                <div key={item.title} className="relative group">
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 my-1 mx-2 rounded-md transition-colors",
                      isActive
                        ? "text-gray-900  bg-gray-300"
                        : "text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "transition-all flex-shrink-0",
                        isActive
                          ? "text-gray-700"
                          : "text-gray-400 group-hover:text-gray-700"
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <div className="flex flex-1 items-center justify-between overflow-hidden">
                        <span className="font-medium truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="ml-2 flex-shrink-0 text-xs font-normal bg-yellow-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>

                  {isCollapsed && item.badge && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-0 w-max p-2 rounded-md bg-white border border-gray-200 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="whitespace-nowrap">
                        <p className="font-medium">{item.title}</p>
                        {item.badge && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {!isCollapsed && (
            <div className="mt-6 mb-2 px-4 text-xs font-semibold uppercase text-gray-500">
              Administration
            </div>
          )}

          <nav className={isCollapsed ? "mt-4" : ""}>
            {visible(secondaryNavigation).map((item) => {
              const isActive = pathname.startsWith(item.url);
              return (
                <div key={item.title} className="relative group">
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 my-1 mx-2 rounded-md transition-colors",
                      isActive
                        ? "text-gray-900  bg-gray-300"
                        : "text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "transition-all flex-shrink-0",
                        isActive
                          ? "text-gray-700"
                          : "text-gray-400 group-hover:text-gray-700"
                      )}
                    >
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <span className="font-medium truncate">{item.title}</span>
                    )}
                  </Link>

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-0 w-max p-2 rounded-md bg-white border border-gray-200 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <p className="whitespace-nowrap font-medium">
                        {item.title}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t-2 py-4 mx-3">
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3 relative group",
                isCollapsed ? "" : "w-full"
              )}
            >
              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                {initials}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{roleLabel}</p>
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-2 bottom-0 w-max p-2 rounded-md bg-white border border-gray-200 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="whitespace-nowrap">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-gray-500">{roleLabel}</p>
                  </div>
                </div>
              )}
            </div>

            <div
              className={cn(
                "flex",
                isCollapsed ? "flex-col gap-2" : "flex-row gap-1"
              )}
            >
              <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors group relative">
                <User className="h-4 w-4" />
                <span
                  className={cn(
                    "absolute px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50",
                    isCollapsed
                      ? "left-full ml-2 top-1/2 -translate-y-1/2"
                      : "bottom-full mb-2 left-1/2 -translate-x-1/2"
                  )}
                >
                  Profile
                </span>
              </button>

              <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors group relative">
                <Settings className="h-4 w-4" />
                <span
                  className={cn(
                    "absolute px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50",
                    isCollapsed
                      ? "left-full ml-2 top-1/2 -translate-y-1/2"
                      : "bottom-full mb-2 left-1/2 -translate-x-1/2"
                  )}
                >
                  Settings
                </span>
              </button>

              <div
                onClick={() => signOut()}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors group relative cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main
        className={cn(
          "flex-1 transition-all bg-white m-3 mb-0 rounded-t-3xl pb-3",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default AppSidebar;
