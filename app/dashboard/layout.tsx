"use client";

import { AppSidebar } from "@/components/app-sidebar";
import ProgressProvider from "@/providers/ProgressProvider";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isSignedIn) return;
    router.push("/");
  }, [isSignedIn]);
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
