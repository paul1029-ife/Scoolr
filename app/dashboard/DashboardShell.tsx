"use client";

import { useState } from "react";

import { AppSidebar, type SidebarUser } from "@/components/app-sidebar";
import { PermissionsProvider } from "@/components/auth/permissions-provider";
import { SessionKeepAlive } from "@/components/auth/session-keepalive";
import { Toaster } from "@/components/ui/toaster";
import ProgressProvider from "@/providers/ProgressProvider";
import type { Permission } from "@/lib/auth/permissions";

/**
 * Client half of the dashboard layout. The layout itself is a server component
 * so it can resolve (and provision) the signed-in user before rendering.
 */
export function DashboardShell({
  user,
  permissions,
  children,
}: {
  user: SidebarUser;
  permissions: Permission[];
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <PermissionsProvider permissions={permissions}>
      <SessionKeepAlive />
      <ProgressProvider>
        <AppSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          user={user}
        >
          {children}
        </AppSidebar>
        <Toaster />
      </ProgressProvider>
    </PermissionsProvider>
  );
}

export default DashboardShell;
