"use client";

import { useState } from "react";
import { usePropertyImages } from "@/hooks/use-property-images";
import { PropertyImages } from "@/components/image/property-images";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProperty, useUpdateProperty } from "@/hooks/use-properties";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { PropertyFormValues } from "@/lib/validation/property.schema";
import { PropertyForm } from "../../_components/form/property-form";
import PageHeading from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPropertyPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const { data, isPending, error } = useProperty(id);
  const update = useUpdateProperty();
  const images = usePropertyImages(id);
  const [saving, setSaving] = useState(false);
  const pending = saving;

  if (isPending) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Card>
          <CardContent>
            <Skeleton className="h-8 w-48" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Card>
          <CardContent>
            <PageHeading heading="Edit Property" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-destructive">
              {error ? formatErrorMessage(error) : "Property not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const property = data.data;

  const defaultValues: Partial<PropertyFormValues> = {
    region_id: property.region_id,
    township_id: property.township_id,
    title: property.title,
    subtitle: property.subtitle ?? "",
    description: property.description ?? "",
    listing_type: property.listing_type,
    property_type: property.property_type,
    status: property.status,
    price_lakhs: Number(property.price_lakhs) || 0,
    price_label: property.price_label ?? "",
    property_size: property.property_size ?? "",
    property_features: property.property_features ?? "",
    local_area: property.local_area ?? "",
    street: property.street ?? "",
    landmark: property.landmark ?? "",
    address_detail: property.address_detail ?? "",
    latitude: property.latitude ? Number(property.latitude) : null,
    longitude: property.longitude ? Number(property.longitude) : null,
    contact_phone: property.contact_phone ?? "",
    contact_viber: property.contact_viber ?? "",
    contact_telegram: property.contact_telegram ?? "",
    is_featured: property.is_featured,
    amenity_ids: property.amenities?.map((a) => a.id) ?? [],
    detail: {
      land_info: "",
      ownership_info: "",
      building_info: "",
      room_info: "",
      road_info: "",
      extra_info: "",
    },
  };

  const onSubmit = async (payload: PropertyFormValues) => {
    if (saving || images.busy || images.loading || images.error) return;
    setSaving(true);
    let detailsSaved = false;
    try {
      await update.mutateAsync({ id, payload });
      detailsSaved = true;
      await images.save(id);
      toast.success("Property updated");
      router.push("/properties");
    } catch (error) {
      toast.error(
        detailsSaved
          ? `Property details saved, but images could not be saved. Retry to finish saving. ${formatErrorMessage(error)}`
          : formatErrorMessage(error),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4">
      <Card>
        <CardContent>
          <PageHeading
            heading="Edit Property"
            routeListRight={[{ href: "/properties", label: "Properties" }]}
          />
        </CardContent>
      </Card>
      <PropertyForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        pending={pending}
        submitDisabled={images.busy || images.loading || !!images.error}
      >
        <PropertyImages editor={images} disabled={pending} />
      </PropertyForm>
    </div>
  );
}
