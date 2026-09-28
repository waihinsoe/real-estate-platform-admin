"use client";

import {
  useQueryStates,
  parseAsInteger,
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { AdminTable } from "./_components/table/admin-table";
import PageHeading from "@/components/layout/page-heading";
import { DebounceInput } from "@/components/input/debounce-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GenericFormDialog from "@/components/dialog/generic-form-dialog";
import { CreateAdminForm } from "./_components/form/create-admin-form";
import { Plus } from "lucide-react";
import { GenericSelect } from "@/components/native-select/generic-select";

export const ADMIN_SORTABLE_FIELDS = [
  "id",
  "name",
  "email",
  "role",
  "created_at",
] as const;

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(""),
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(PAGE_SIZE),
    role: parseAsStringLiteral(["SUPER_ADMIN", "ADMIN"]),
    is_active: parseAsBoolean,
    sort_by: parseAsStringLiteral(ADMIN_SORTABLE_FIELDS).withDefault("id"),
    sort_direction: parseAsStringLiteral(["asc", "desc"]).withDefault("asc"),
  });

  return (
    <div className="flex flex-col gap-3 p-4">
      <Card>
        <CardContent>
          <PageHeading heading="Admin users" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center">
          <DebounceInput
            className="min-w-0 sm:basis-full xl:basis-0 xl:flex-1"
            value={query.search}
            onDebouncedChange={(value) =>
              setQuery({ search: value, pageIndex: 0 })
            }
            placeholder="Search by name, email, or role"
          />
          <GenericSelect
            className="w-full sm:w-40"
            label="Admin role"
            placeholder="All roles"
            options={[
              { value: "ADMIN", label: "Admin" },
              { value: "SUPER_ADMIN", label: "Super admin" },
            ]}
            value={query.role}
            onValueChange={(role) => setQuery({ role, pageIndex: 0 })}
          />
          <GenericSelect
            className="w-full sm:w-40"
            label="Admin status"
            placeholder="All statuses"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            value={
              query.is_active === null
                ? null
                : query.is_active
                  ? "true"
                  : "false"
            }
            onValueChange={(value) =>
              setQuery({
                is_active: value === null ? null : value === "true",
                pageIndex: 0,
              })
            }
          />
          <GenericFormDialog
            title="Add Admin User"
            contentClassName="max-h-[calc(100dvh-2rem)] overflow-y-auto"
            trigger={
              <Button
                type="button"
                className="w-full sm:ml-auto sm:w-auto sm:shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add Admin User
              </Button>
            }
          >
            {({ setOpen }) => (
              <CreateAdminForm onClose={() => setOpen(false)} />
            )}
          </GenericFormDialog>
        </CardHeader>
        <CardContent>
          <AdminTable query={query} setQuery={setQuery} />
        </CardContent>
      </Card>
    </div>
  );
}
