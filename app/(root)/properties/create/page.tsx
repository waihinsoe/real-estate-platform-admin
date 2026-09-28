"use client";

import { useRef, useState } from "react";
import { usePropertyImages } from "@/hooks/use-property-images";
import { PropertyImages } from "@/components/image/property-images";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateProperty, useUpdateProperty } from "@/hooks/use-properties";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { PropertyFormValues } from "@/lib/validation/property.schema";
import { PropertyForm } from "../_components/form/property-form";
import PageHeading from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";

export default function CreatePropertyPage() {
  const router = useRouter();
  const create = useCreateProperty();
  const update = useUpdateProperty();
  const images = usePropertyImages();
  const createdId = useRef<number | null>(null);
  const [saving, setSaving] = useState(false);
  const pending = saving;

  const onSubmit = async (payload: PropertyFormValues) => {
    if (saving || images.busy) return;
    setSaving(true);
    try {
      if (createdId.current === null) {
        const response = await create.mutateAsync(payload);
        createdId.current = response.data.id;
      } else {
        await update.mutateAsync({ id: createdId.current, payload });
      }
      await images.save(createdId.current);
      toast.success("Property created");
      router.push("/properties");
    } catch (error) {
      toast.error(
        createdId.current === null
          ? formatErrorMessage(error)
          : `Property was created, but saving is incomplete. Retry to finish saving. ${formatErrorMessage(error)}`,
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
            heading="Create Property"
            routeListRight={[{ href: "/properties", label: "Properties" }]}
          />
        </CardContent>
      </Card>
      <PropertyForm
        onSubmit={onSubmit}
        submitLabel="Create property"
        pendingLabel="Creating…"
        pending={pending}
        submitDisabled={images.busy}
      >
        <PropertyImages editor={images} disabled={pending} />
      </PropertyForm>
    </div>
  );
}
