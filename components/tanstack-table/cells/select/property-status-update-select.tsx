"use client";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { PropertyStatusSelect } from "@/components/select/property-status-select";
import { useUpdateProperty } from "@/hooks/use-properties";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { Property, PropertyStatus } from "@/types/property";

type PropertyStatusUpdateSelectProps = {
  property: Pick<Property, "id" | "title" | "status">;
};

export function PropertyStatusUpdateSelect({
  property,
}: PropertyStatusUpdateSelectProps) {
  const updateProperty = useUpdateProperty();
  const displayedStatus = updateProperty.isPending
    ? (updateProperty.variables?.payload.status ?? property.status)
    : property.status;

  const changeStatus = async (status: PropertyStatus) => {
    if (status === property.status || updateProperty.isPending) {
      return;
    }

    try {
      await updateProperty.mutateAsync({
        id: property.id,
        payload: { status },
      });
      toast.success("Property status updated");
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <PropertyStatusSelect
        className="w-36"
        aria-label={`Status for ${property.title}`}
        aria-busy={updateProperty.isPending}
        value={displayedStatus}
        disabled={updateProperty.isPending}
        onValueChange={(status) => void changeStatus(status)}
      />
      {updateProperty.isPending && (
        <span role="status">
          <LoaderCircle
            className="size-4 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
          <span className="sr-only">Saving property status</span>
        </span>
      )}
    </div>
  );
}
