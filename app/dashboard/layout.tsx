"use client";

import { AppSidebar } from "@/components/app-sidebar";
import ProgressProvider from "@/providers/ProgressProvider";

import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <ProgressProvider>
        <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}>
          {children}
        </AppSidebar>
      </ProgressProvider>
    </>
  );
}
