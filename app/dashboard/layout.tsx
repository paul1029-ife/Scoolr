import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
          <main>{children}</main>
        </ProgressProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
