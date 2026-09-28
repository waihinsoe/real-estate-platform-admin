"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AmenitySchema, type AmenityFormValues } from "@/lib/validation/amenity.schema";
import { useUpdateAmenity } from "@/hooks/use-amenities";
import { formatErrorMessage } from "@/lib/format/format-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import type { Amenity } from "@/types/amenity";

export function EditAmenityForm({ item, onClose }: { item: Amenity; onClose: () => void; }) {
  const id = useId();
  const edit = useUpdateAmenity();
  const form = useForm<AmenityFormValues>({
    resolver: zodResolver(AmenitySchema),
    defaultValues: {
      name: item.name,
    },
  });
  const pending = form.formState.isSubmitting || edit.isPending;

  const onSubmit = async (payload: AmenityFormValues) => {
    try {
      await edit.mutateAsync({ id: item.id, payload });
      toast.success("Amenity updated");
      onClose();
    } catch (error) {
      toast.error(formatErrorMessage(error));
    }
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} aria-busy={pending}>
      <FieldSet disabled={pending}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
                <Input
                  {...field}
                  id={`${id}-name`}
                  type="text"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? `${id}-name-error` : undefined}
                />
                {fieldState.invalid && (
                  <FieldError id={`${id}-name-error`} errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field orientation="horizontal" className="justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
