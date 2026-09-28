import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarHeader } from "@/components/sidebar/sidebar-header";
// import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { ScrollToTopButton } from "@/components/custom-ui/button/scroll-to-top-button";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 50)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Toaster />
      <AppSidebar variant="inset" />
      <SidebarInset className="min-w-0">
        <SidebarHeader />
        {children}
      </SidebarInset>
      {/* <ScrollToTopButton /> */}
    </SidebarProvider>
  );
}
