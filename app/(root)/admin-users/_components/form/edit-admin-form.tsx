"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  EditAdminSchema,
  type EditAdminFormValues,
  type CreateAdminFormValues,
} from "@/lib/validation/admin.schema";
import type { AdminUserType } from "@/types/admin-user";
import { useUpdateAdminUser } from "@/hooks/use-admin-users";
import { formatErrorMessage } from "@/lib/format/format-error";
import { Button } from "@/components/ui/button";
import { useId } from "react";
import { AdminRoleSelect } from "@/components/native-select/admin-role-select";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function EditAdminForm({
  item,
  onClose,
}: {
  item: AdminUserType;
  onClose: () => void;
}) {
  const id = useId();
  const update = useUpdateAdminUser();
  const form = useForm<EditAdminFormValues>({
    resolver: zodResolver(EditAdminSchema),
    defaultValues: {
      name: item.name,
      email: item.email,
      role: item.role,
      is_active: item.is_active,
      password: "",
      password_confirmation: "",
    },
  });
  const pending = form.formState.isSubmitting || update.isPending;

  const onSubmit = async (values: EditAdminFormValues) => {
    const { password, password_confirmation, role, ...details } = values;
    const payload: Partial<CreateAdminFormValues> = {
      ...details,
      ...(role ? { role } : {}),
      ...(password ? { password, password_confirmation } : {}),
    };

    try {
      await update.mutateAsync({ id: item.id, payload });
      toast.success("Admin updated");
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
                  value={field.value ?? ""}
                  id={`${id}-name`}
                  type="text"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${id}-name-error` : undefined
                  }
                />
                {fieldState.invalid && (
                  <FieldError
                    id={`${id}-name-error`}
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${id}-email-error` : undefined
                  }
                />
                {fieldState.invalid && (
                  <FieldError
                    id={`${id}-email-error`}
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-password`}>New password</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id={`${id}-password`}
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={`${id}-password-help ${fieldState.invalid ? `${id}-password-error` : ""}`}
                />
                <FieldDescription id={`${id}-password-help`}>
                  Leave blank to keep the current password.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError
                    id={`${id}-password-error`}
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="password_confirmation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-password_confirmation`}>
                  Confirm password
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id={`${id}-password_confirmation`}
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid
                      ? `${id}-password_confirmation-error`
                      : undefined
                  }
                />
                {fieldState.invalid && (
                  <FieldError
                    id={`${id}-password_confirmation-error`}
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-role`}>Role</FieldLabel>
                <AdminRoleSelect
                  {...field}
                  value={field.value ?? ""}
                  id={`${id}-role`}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${id}-role-error` : undefined
                  }
                />
                {fieldState.invalid && (
                  <FieldError
                    id={`${id}-role-error`}
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="is_active"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={`${id}-is-active`}>Active</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError
                      id={`${id}-is-active-error`}
                      errors={[fieldState.error]}
                    />
                  )}
                </FieldContent>
                <Switch
                  id={`${id}-is-active`}
                  name={field.name}
                  ref={field.ref}
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={pending}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${id}-is-active-error` : undefined
                  }
                />
              </Field>
            )}
          />
          <Field orientation="horizontal" className="justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
