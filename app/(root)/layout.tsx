import { AuthGuard } from "@/components/auth/auth-guard";
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <AuthGuard>
      <SidebarWrapper>{children}</SidebarWrapper>
    </AuthGuard>
  );
}
