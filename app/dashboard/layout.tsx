"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import ProgressProvider from "@/providers/ProgressProvider";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <SidebarProvider>
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <SidebarInset>
        <ProgressProvider>
          <main className={cn(isCollapsed ? "pl-12" : "pl-60")}>
            {children}
          </main>
        </ProgressProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
