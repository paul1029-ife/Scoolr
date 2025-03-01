"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Disc,
  Home,
  PenSquare,
  Shirt,
  Timer,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
const primaryNavigation = [
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
    badge: "12 new",
  },
  {
    title: "Teachers",
    url: "/dashboard/teachers",
    icon: <PenSquare className="h-5 w-5" />,
  },
];

const secondaryNavigation = [
  {
    title: "Billing",
    url: "/dashboard/billings",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: <Timer className="h-5 w-5" />,
  },
];

export function AppSidebar({ isCollapsed, setIsCollapsed }: AppSidebarProps) {
  const pathname = usePathname();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 bottom-0 z-50",
        "flex flex-col border-r border-gray-100 bg-gray-50 transition-all duration-200 ease-in-out overflow-hidden",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
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
            <h1 className="font-semibold text-lg">TBC ADMIN</h1>
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
          className="text-gray-500 hover:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        {!isCollapsed && (
          <div className="mb-2 px-4 text-xs font-semibold uppercase text-gray-500">
            Main
          </div>
        )}

        <nav className="overflow-hidden">
          {primaryNavigation.map((item) => {
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
                      ? "text-gray-700 border-l-4 border-blue-500 bg-gray-100"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span
                    className={cn(
                      "transition-all",
                      isActive
                        ? "text-gray-700"
                        : "text-gray-400 group-hover:text-gray-700"
                    )}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex flex-1 items-center justify-between">
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs font-normal bg-yellow-100 text-gray-600 px-2 py-0.5 rounded-full">
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
                  <div className="absolute left-full ml-2 top-0 w-auto p-2 rounded-md bg-white border border-gray-200 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
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
          {secondaryNavigation.map((item) => {
            const isActive = pathname.startsWith(item.url);
            return (
              <div key={item.title} className="relative group">
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 my-1 mx-2 rounded-md transition-colors",
                    isActive
                      ? "text-blue-500 border-l-4 border-blue-500 bg-gray-100"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span
                    className={cn(
                      "transition-all",
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-700"
                    )}
                  >
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>

                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-0 w-auto p-2 rounded-md bg-white border border-gray-200 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
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

      <div className="border-t border-gray-200 p-4">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3 cursor-pointer relative group",
              isCollapsed ? "" : "w-full"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
              AD
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <p className="text-sm font-medium">Admin User</p>
                <p className="truncate text-xs text-gray-500">
                  admin@example.com
                </p>
              </div>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-2 bottom-0 w-auto p-2 rounded-md bg-white border border-gray-200 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="whitespace-nowrap">
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
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
                  "absolute px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all",
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
                  "absolute px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all",
                  isCollapsed
                    ? "left-full ml-2 top-1/2 -translate-y-1/2"
                    : "bottom-full mb-2 left-1/2 -translate-x-1/2"
                )}
              >
                Settings
              </span>
            </button>

            <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors group relative">
              <LogOut className="h-4 w-4" />
              <span
                className={cn(
                  "absolute px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all",
                  isCollapsed
                    ? "left-full ml-2 top-1/2 -translate-y-1/2"
                    : "bottom-full mb-2 left-1/2 -translate-x-1/2"
                )}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;
