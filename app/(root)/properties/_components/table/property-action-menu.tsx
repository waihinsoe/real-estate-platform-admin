"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ActionMenu from "@/components/tanstack-table/menu-item/action-menu";
import { useDeleteProperty } from "@/hooks/use-properties";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { Property } from "@/types/property";

export function PropertyActionMenu({ item }: { item: Property }) {
  const router = useRouter();
  const deleteProperty = useDeleteProperty();

  const onDelete = async () => {
    try {
      await deleteProperty.mutateAsync(item.id);
      toast.success("Property deleted");
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  const onEdit = () => {
    router.push(`/properties/${item.id}/edit`);
  };

  return (
    <ActionMenu
      onDelete={onDelete}
      isDeleting={deleteProperty.isPending}
      onEdit={onEdit}
    />
  );
}
