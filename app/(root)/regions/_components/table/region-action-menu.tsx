"use client";

import { toast } from "sonner";
import ActionMenu from "@/components/tanstack-table/menu-item/action-menu";
import { useDeleteRegion } from "@/hooks/use-regions";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { RegionType } from "@/types/region";
import { EditRegionForm } from "../form/edit-region-form";

export function RegionActionMenu({ item }: { item: RegionType }) {
  const deleteRegion = useDeleteRegion();

  const onDelete = async () => {
    try {
      await deleteRegion.mutateAsync(item.id);
      toast.success("Region deleted");
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  return (
    <ActionMenu
      onDelete={onDelete}
      isDeleting={deleteRegion.isPending}
      editTitle="Edit Region"
      onEditForm={({ onClose }) => (
        <EditRegionForm item={item} onClose={onClose} />
      )}
    />
  );
}
