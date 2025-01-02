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
  GalleryVerticalEnd,
  HomeIcon,
  Shirt,
  Timer,
} from "lucide-react";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      isActive: true,
      url: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      title: "Subjects",
      url: "dashboard/subjects",
      icon: <Disc />,
    },
    {
      title: "Students",
      url: "dashboard/students",
      icon: <Shirt />,
    },
    {
      title: "Billings",
      url: "dashboard/billings",
      icon: <CreditCard />,
    },
    {
      title: "Events",
      url: "dashboard/events",
      icon: <Timer />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        <h1>TBC DASHBOARD</h1>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarMenu key={item.title}>
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="h-10 text-2xl w-full flex pl-2"
                asChild
                isActive={item.isActive}
              >
                <a href={item.url}>
                  {item.icon}
                  {item.title}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <div></div>
          </SidebarMenu>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
