"use client";

import { toast } from "sonner";
import ActionMenu from "@/components/tanstack-table/menu-item/action-menu";
import { useDeleteAmenity } from "@/hooks/use-amenities";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { Amenity } from "@/types/amenity";
import { EditAmenityForm } from "../form/edit-amenity-form";

export function AmenityActionMenu({ item }: { item: Amenity }) {
  const deleteAmenity = useDeleteAmenity();

  const onDelete = async () => {
    try {
      await deleteAmenity.mutateAsync(item.id);
      toast.success("Amenity deleted");
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  return (
    <ActionMenu
      onDelete={onDelete}
      isDeleting={deleteAmenity.isPending}
      editTitle="Edit Amenity"
      onEditForm={({ onClose }) => (
        <EditAmenityForm item={item} onClose={onClose} />
      )}
    />
  );
}
