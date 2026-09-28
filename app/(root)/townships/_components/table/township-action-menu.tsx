"use client";

import { toast } from "sonner";
import ActionMenu from "@/components/tanstack-table/menu-item/action-menu";
import { useDeleteTownship } from "@/hooks/use-townships";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { TownshipType } from "@/types/township";
import { EditTownshipForm } from "../form/edit-township-form";

export function TownshipActionMenu({ item }: { item: TownshipType }) {
  const deleteTownship = useDeleteTownship();

  const onDelete = async () => {
    try {
      await deleteTownship.mutateAsync(item.id);
      toast.success("Township deleted");
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  return (
    <ActionMenu
      onDelete={onDelete}
      isDeleting={deleteTownship.isPending}
      editTitle="Edit Township"
      onEditForm={({ onClose }) => (
        <EditTownshipForm item={item} onClose={onClose} />
      )}
    />
  );
}
