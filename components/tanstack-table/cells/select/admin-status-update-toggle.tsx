"use client";

import { useId } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useUpdateAdminUser } from "@/hooks/use-admin-users";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { AdminUserType } from "@/types/admin-user";
import { useAuthStore } from "@/store/use-auth-store";

type AdminStatusUpdateToggleProps = {
  admin: Pick<AdminUserType, "id" | "name" | "is_active">;
};

export function AdminStatusUpdateToggle({
  admin,
}: AdminStatusUpdateToggleProps) {
  const id = useId();
  const updateAdmin = useUpdateAdminUser();
  const canEdit = useAuthStore(
    (state) => state.user?.role === "SUPER_ADMIN" && state.user.id !== admin.id,
  );
  const isActive = updateAdmin.isPending
    ? (updateAdmin.variables?.payload.is_active ?? admin.is_active)
    : admin.is_active;

  const changeStatus = async (is_active: boolean) => {
    if (!canEdit || is_active === admin.is_active || updateAdmin.isPending)
      return;

    try {
      await updateAdmin.mutateAsync({ id: admin.id, payload: { is_active } });
      toast.success("Admin status updated");
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={id}
        checked={isActive}
        onCheckedChange={(checked) => void changeStatus(checked)}
        disabled={!canEdit || updateAdmin.isPending}
        aria-label={`Active status for ${admin.name}`}
        aria-busy={updateAdmin.isPending}
        className="data-checked:bg-emerald-600 data-disabled:opacity-100! dark:data-checked:bg-emerald-500"
      />

      {updateAdmin.isPending ? (
        <span role="status">
          <LoaderCircle
            className="min-w-4 size-3.5 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
          <span className="sr-only">Saving admin status</span>
        </span>
      ) : (
        <label
          htmlFor={id}
          className={`min-w-14 text-xs font-medium ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"} ${!canEdit ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isActive ? "Active" : "Inactive"}
        </label>
      )}
    </div>
  );
}
