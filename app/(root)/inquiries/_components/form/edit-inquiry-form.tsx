"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { InquirySchema, type InquiryFormValues } from "@/lib/validation/inquiry.schema";
import { useUpdateInquiry } from "@/hooks/use-inquiry";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { formatErrorMessage } from "@/lib/format/format-error";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { INQUIRY_STATUSES, type Inquiry } from "@/types/inquiry";

export function EditInquiryForm({ item, onClose }: { item: Inquiry; onClose: () => void }) {
  const id = useId();
  const edit = useUpdateInquiry();
  const admins = useAdminUsers({ page: 1, limit: 100 });
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(InquirySchema),
    defaultValues: { status: item.status, assigned_to_admin_id: item.assigned_to_admin_id ?? undefined },
  });
  const pending = form.formState.isSubmitting || edit.isPending;
  const onSubmit = async (payload: InquiryFormValues) => {
    try {
      await edit.mutateAsync({ id: item.id, payload });
      toast.success("Inquiry updated");
      onClose();
    } catch (error) { toast.error(formatErrorMessage(error)); }
  };
  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} aria-busy={pending}>
      <FieldSet disabled={pending}>
        <FieldGroup>
          <Controller name="status" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>
              <NativeSelect {...field} id={`${id}-status`} className="w-full" aria-invalid={fieldState.invalid}>
                {INQUIRY_STATUSES.map((status) => <NativeSelectOption key={status} value={status}>{status.replaceAll("_", " ")}</NativeSelectOption>)}
              </NativeSelect>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )} />
          <Controller name="assigned_to_admin_id" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${id}-admin`}>Assigned admin</FieldLabel>
              <NativeSelect {...field} id={`${id}-admin`} className="w-full" value={field.value ?? ""}
                disabled={admins.isPending || admins.isError}
                onChange={(event) => field.onChange(Number(event.target.value))} aria-invalid={fieldState.invalid}>
                <NativeSelectOption value="" disabled>{admins.isPending ? "Loading admins..." : "Select admin"}</NativeSelectOption>
                {item.assigned_to_admin_id && !admins.data?.data.some((admin) => admin.id === item.assigned_to_admin_id) && (
                  <NativeSelectOption value={item.assigned_to_admin_id}>Admin #{item.assigned_to_admin_id}</NativeSelectOption>
                )}
                {admins.data?.data.map((admin) => <NativeSelectOption key={admin.id} value={admin.id}>{admin.name}</NativeSelectOption>)}
              </NativeSelect>
              {admins.isError && <button type="button" className="text-sm text-destructive underline" onClick={() => void admins.refetch()}>Retry admins</button>}
              <FieldError errors={[fieldState.error]} />
            </Field>
          )} />
          <Field orientation="horizontal" className="justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{pending ? "Saving…" : "Save changes"}</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
