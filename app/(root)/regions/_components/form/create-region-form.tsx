"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RegionSchema, type RegionFormValues } from "@/lib/validation/region.schema";
import { useCreateRegion } from "@/hooks/use-regions";
import { formatErrorMessage } from "@/lib/format/format-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

export function CreateRegionForm({ onClose }: { onClose: () => void; }) {
  const id = useId();
  const create = useCreateRegion();
  const form = useForm<RegionFormValues>({
    resolver: zodResolver(RegionSchema),
    defaultValues: {
      name_en: "",
      name_mm: "",
      slug: "",
    },
  });
  const pending = form.formState.isSubmitting || create.isPending;

  const onSubmit = async (payload: RegionFormValues) => {
    try {
      await create.mutateAsync(payload);
      toast.success("Region created");
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
            name="name_en"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-name_en`}>English Name</FieldLabel>
                <Input
                  {...field}
                  id={`${id}-name_en`}
                  type="text"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? `${id}-name_en-error` : undefined}
                />
                {fieldState.invalid && (
                  <FieldError id={`${id}-name_en-error`} errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="name_mm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-name_mm`}>Myanmar Name</FieldLabel>
                <Input
                  {...field}
                  id={`${id}-name_mm`}
                  type="text"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? `${id}-name_mm-error` : undefined}
                />
                {fieldState.invalid && (
                  <FieldError id={`${id}-name_mm-error`} errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-slug`}>Slug</FieldLabel>
                <Input
                  {...field}
                  id={`${id}-slug`}
                  type="text"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? `${id}-slug-error` : undefined}
                />
                {fieldState.invalid && (
                  <FieldError id={`${id}-slug-error`} errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field orientation="horizontal" className="justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">
              {pending ? "Creating…" : "Create region"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
