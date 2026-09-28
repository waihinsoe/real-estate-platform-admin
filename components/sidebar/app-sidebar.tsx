"use client";

import {
  Building2,
  LayoutDashboard,
  ListChecks,
  Map,
  MapPin,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Admin Users",
    url: "/admin-users",
    icon: ShieldCheck,
  },
  {
    title: "Regions",
    url: "/regions",
    icon: Map,
  },
  {
    title: "Townships",
    url: "/townships",
    icon: MapPin,
  },
  {
    title: "Properties",
    url: "/properties",
    icon: Building2,
  },
  {
    title: "Amenities",
    url: "/amenities",
    icon: ListChecks,
  },
  {
    title: "Inquiries",
    url: "/inquiries",
    icon: MessageSquareText,
  },
];

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathName = usePathname();

  const isActive = (url: string) =>
    url === "/"
      ? pathName === url
      : pathName.startsWith(`${url}/`) || pathName === url;

  return (
    <Sidebar {...props} variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Logo />}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => {
              const active = isActive(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={active}
                    className={cn(
                      active
                        ? "data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground [&>svg]:text-sidebar-primary-foreground"
                        : "data-active:bg-transparent data-active:font-normal data-active:text-sidebar-foreground [&>svg]:text-sidebar-foreground",
                    )}
                    render={
                      <Link
                        href={item.url}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
