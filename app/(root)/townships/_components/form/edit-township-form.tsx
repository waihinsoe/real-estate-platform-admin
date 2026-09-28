"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TownshipSchema, type TownshipFormValues } from "@/lib/validation/township.schema";
import { useUpdateTownship } from "@/hooks/use-townships";
import { formatErrorMessage } from "@/lib/format/format-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import type { TownshipType } from "@/types/township";

export function EditTownshipForm({ item, onClose }: { item: TownshipType; onClose: () => void; }) {
  const id = useId();
  const edit = useUpdateTownship();
  const form = useForm<TownshipFormValues>({
    resolver: zodResolver(TownshipSchema),
    defaultValues: {
      name_en: item.name_en,
      name_mm: item.name_mm,
      slug: item.slug,
      region_id: item.region_id,
    },
  });
  const pending = form.formState.isSubmitting || edit.isPending;

  const onSubmit = async (payload: TownshipFormValues) => {
    try {
      await edit.mutateAsync({ id: item.id, payload });
      toast.success("Township updated");
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
          <Controller
            name="region_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-region_id`}>Region ID</FieldLabel>
                <Input
                  {...field}
                  id={`${id}-region_id`}
                  type="number"
                  min={1}
                  step={1}
                  value={Number.isNaN(field.value) ? "" : field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.valueAsNumber)}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? `${id}-region_id-error` : undefined}
                />
                {fieldState.invalid && (
                  <FieldError id={`${id}-region_id-error`} errors={[fieldState.error]} />
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
