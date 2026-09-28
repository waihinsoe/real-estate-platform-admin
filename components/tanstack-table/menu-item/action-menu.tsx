"use client";

import type { ReactElement } from "react";
import { Edit, Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenericFormDialog from "@/components/dialog/generic-form-dialog";

type Props = {
  onDelete?: () => void | Promise<void>;
  isDeleting?: boolean;
  onEdit?: () => void;
  onEditForm?: (props: { onClose: () => void }) => ReactElement;
  editTitle?: string;
};

function ActionMenu({
  onDelete,
  isDeleting = false,
  onEdit,
  onEditForm,
  editTitle = "Edit",
}: Props) {
  if (!onEdit && !onEditForm && !onDelete) return null;

  const editButton = (
    <Button
      type="button"
      variant="outline"
      className="text-blue-500 rounded-full size-10 hover:bg-blue-500 hover:text-white transition cursor-pointer"
      title="Edit"
      aria-label="Edit"
      disabled={isDeleting}
      onClick={onEdit}
    >
      <Edit />
    </Button>
  );

  return (
    <div className="flex gap-2">
      {onEdit ? (
        editButton
      ) : onEditForm ? (
        <GenericFormDialog
          trigger={editButton}
          title={editTitle}
          contentClassName="max-h-[calc(100dvh-2rem)] overflow-y-auto"
        >
          {({ setOpen }) => onEditForm({ onClose: () => setOpen(false) })}
        </GenericFormDialog>
      ) : null}
      {onDelete && (
        <Button
          type="button"
          variant="outline"
          className="text-red-500 rounded-full size-10 hover:bg-red-400 hover:text-white transition cursor-pointer"
          title="Delete"
          aria-label={isDeleting ? "Deleting" : "Delete"}
          aria-busy={isDeleting}
          disabled={isDeleting}
          onClick={onDelete}
        >
          {isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}
        </Button>
      )}
    </div>
  );
}

export default ActionMenu;
