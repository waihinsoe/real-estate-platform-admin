"use client";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminRoleSelect } from "@/components/native-select/admin-role-select";
import { useUpdateAdminUser } from "@/hooks/use-admin-users";
import { formatErrorMessage } from "@/lib/format/format-error";
import { useAuthStore } from "@/store/use-auth-store";
import type { AdminRoleEnum, AdminUserType } from "@/types/admin-user";

export function AdminRoleUpdateSelect({
  admin,
}: {
  admin: Pick<AdminUserType, "id" | "name" | "role">;
}) {
  const canEdit = useAuthStore(
    (state) => state.user?.role === "SUPER_ADMIN" && state.user.id !== admin.id,
  );
  const updateAdmin = useUpdateAdminUser();
  const displayedRole = updateAdmin.isPending
    ? (updateAdmin.variables?.payload.role ?? admin.role)
    : admin.role;

  const changeRole = async (role: AdminRoleEnum) => {
    if (!canEdit || role === admin.role || updateAdmin.isPending) return;

    try {
      await updateAdmin.mutateAsync({ id: admin.id, payload: { role } });
      toast.success("Admin role updated");
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AdminRoleSelect
        className="w-36 has-[select:disabled]:opacity-100! [&_select:disabled]:text-foreground [&_select:disabled]:opacity-100"
        aria-label={`Role for ${admin.name}`}
        aria-busy={updateAdmin.isPending}
        value={displayedRole}
        disabled={!canEdit || updateAdmin.isPending}
        onChange={(event) => {
          const role = event.target.value;
          if (role === "ADMIN" || role === "SUPER_ADMIN") void changeRole(role);
        }}
      />
      {updateAdmin.isPending && (
        <span role="status">
          <LoaderCircle
            aria-hidden="true"
            className="size-3.5 animate-spin text-muted-foreground"
          />
          <span className="sr-only">Saving admin role</span>
        </span>
      )}
    </div>
  );
}
