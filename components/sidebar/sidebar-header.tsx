import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggleButton from "./theme-toggle-button";
import { AdminHeader } from "./admin-header";

export function SidebarHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 shadow-xs backdrop-blur-lg transition-[width,height] ease-linear supports-backdrop-filter:bg-background/85 group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex md:hidden">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggleButton />
          <AdminHeader />
        </div>
      </div>
    </header>
  );
}
