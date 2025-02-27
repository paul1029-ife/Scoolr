"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  CreditCard,
  Disc,
  HomeIcon,
  PenSquareIcon,
  Shirt,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { SignedIn, UserButton } from "@clerk/nextjs";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <HomeIcon className="size-5" />,
  },
  {
    title: "Subjects",
    url: "/dashboard/subjects",
    icon: <Disc className="size-5" />,
  },
  {
    title: "Students",
    url: "/dashboard/students",
    icon: <Shirt className="size-5" />,
  },
  {
    title: "Teachers",
    url: "/dashboard/teachers",
    icon: <PenSquareIcon className="size-5" />,
  },
  {
    title: "Billings",
    url: "/dashboard/billings",
    icon: <CreditCard className="size-5" />,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: <Timer className="size-5" />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex items-start gap-2 px-4 py-2">
        <h1 className="font-semibold text-lg">TBC DASHBOARD</h1>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {navigationItems.map((item) => (
          <SidebarMenu key={item.title}>
            <SidebarMenuItem>
              <SidebarMenuButton
                className={`flex w-full items-center gap-3 px-4 py-2`}
                asChild
                isActive={pathname === item.url}
              >
                <Link href={item.url} className="text-2xl">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ))}
        {/* <div className="flex w-full items-center gap-3 px-3 py-2">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div> */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
