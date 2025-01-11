import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProgressProvider from "@/providers/ProgressProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ProgressProvider>
          <main>
            <SidebarTrigger className="-ml-1" />
            {children}
          </main>
        </ProgressProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
