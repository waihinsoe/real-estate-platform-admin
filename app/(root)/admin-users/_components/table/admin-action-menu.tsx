"use client";

import { toast } from "sonner";
import ActionMenu from "@/components/tanstack-table/menu-item/action-menu";
import { useDeleteAdminUser } from "@/hooks/use-admin-users";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { AdminUserType } from "@/types/admin-user";
import { EditAdminForm } from "../form/edit-admin-form";

export function AdminActionMenu({ item }: { item: AdminUserType }) {
  const deleteAdmin = useDeleteAdminUser();

  const onDelete = async () => {
    try {
      await deleteAdmin.mutateAsync(item.id);
      toast.success("Admin deleted");
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  return (
    <ActionMenu
      onDelete={onDelete}
      isDeleting={deleteAdmin.isPending}
      editTitle="Edit Admin User"
      onEditForm={({ onClose }) => (
        <EditAdminForm item={item} onClose={onClose} />
      )}
    />
  );
}
