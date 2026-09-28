"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { InquiryActivitySchema, type InquiryActivityFormValues } from "@/lib/validation/inquiry.schema";
import { useCreateInquiryActivity } from "@/hooks/use-inquiry";
import { formatErrorMessage } from "@/lib/format/format-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

export function CreateInquiryActivityForm({ inquiryId, onClose }: { inquiryId: number; onClose: () => void }) {
  const id = useId();
  const create = useCreateInquiryActivity();
  const form = useForm<InquiryActivityFormValues>({
    resolver: zodResolver(InquiryActivitySchema),
    defaultValues: { note: "", next_follow_up_at: "" },
  });
  const pending = form.formState.isSubmitting || create.isPending;
  const onSubmit = async (values: InquiryActivityFormValues) => {
    try {
      await create.mutateAsync({ id: inquiryId, payload: {
        activity_type: "NOTE",
        note: values.note,
        ...(values.next_follow_up_at ? { next_follow_up_at: new Date(values.next_follow_up_at).toISOString() } : {}),
      } });
      toast.success("Activity added");
      onClose();
    } catch (error) { toast.error(formatErrorMessage(error)); }
  };
  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} aria-busy={pending}>
      <FieldSet disabled={pending}>
        <FieldGroup>
          <Controller name="note" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${id}-note`}>Note</FieldLabel>
              <Textarea {...field} id={`${id}-note`} rows={4} aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )} />
          <Controller name="next_follow_up_at" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${id}-follow-up`}>Next follow-up (optional)</FieldLabel>
              <Input {...field} id={`${id}-follow-up`} type="datetime-local" aria-invalid={fieldState.invalid} />
              <p className="text-sm text-muted-foreground">Enter the time in your local time zone.</p>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )} />
          <Field orientation="horizontal" className="justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{pending ? "Adding…" : "Add note"}</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
