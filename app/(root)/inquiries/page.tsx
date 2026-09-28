"use client";

import {
  useQueryStates,
  parseAsInteger,
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { InquiryTable } from "./_components/table/inquiry-table";
import PageHeading from "@/components/layout/page-heading";
import { DebounceInput } from "@/components/input/debounce-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GenericSelect } from "@/components/native-select/generic-select";
import {
  InquiryStatusSelect,
  InquiryTypeSelect,
  InquirySourceSelect,
} from "@/components/native-select/inquiry-filter-select";
import {
  INQUIRY_SORT_FIELDS,
  INQUIRY_STATUSES,
  INQUIRY_TYPES,
  INQUIRY_SOURCES,
} from "@/types/inquiry";
import { useProperties } from "@/hooks/use-properties";
import { useAdminUsers } from "@/hooks/use-admin-users";

const PAGE_SIZE = 10;

export default function InquiriesPage() {
  const properties = useProperties({ page: 1, limit: 100 });
  const admins = useAdminUsers({ page: 1, limit: 100 });
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(""),
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(PAGE_SIZE),
    status: parseAsStringLiteral(INQUIRY_STATUSES),
    inquiry_type: parseAsStringLiteral(INQUIRY_TYPES),
    source: parseAsStringLiteral(INQUIRY_SOURCES),
    property_id: parseAsString,
    assigned_to_admin_id: parseAsString,
    include_activities: parseAsBoolean,
    sort_by: parseAsStringLiteral(INQUIRY_SORT_FIELDS).withDefault("id"),
    sort_direction: parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
  });
  return (
    <div className="flex flex-col gap-3 p-4">
      <Card>
        <CardContent>
          <PageHeading heading="Inquiries" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center">
          <DebounceInput
            className="min-w-0 sm:basis-full xl:basis-0 xl:flex-1"
            value={query.search}
            onDebouncedChange={(search) => setQuery({ search, pageIndex: 0 })}
            placeholder="Search inquiries…"
          />
          <InquiryStatusSelect
            className="w-full sm:w-44"
            value={query.status}
            onValueChange={(status) => setQuery({ status, pageIndex: 0 })}
          />
          <InquiryTypeSelect
            className="w-full sm:w-44"
            value={query.inquiry_type}
            onValueChange={(inquiry_type) =>
              setQuery({ inquiry_type, pageIndex: 0 })
            }
          />
          <InquirySourceSelect
            className="w-full sm:w-40"
            value={query.source}
            onValueChange={(source) => setQuery({ source, pageIndex: 0 })}
          />
          <div className="w-full space-y-1 sm:w-48">
            <GenericSelect
              label="Property"
              placeholder={
                properties.isPending
                  ? "Loading properties..."
                  : "All properties"
              }
              disabled={properties.isPending || properties.isError}
              value={query.property_id}
              options={
                properties.data?.data.map((item) => ({
                  value: String(item.id),
                  label: item.title,
                })) ?? []
              }
              onValueChange={(property_id) =>
                setQuery({ property_id, pageIndex: 0 })
              }
            />
            {properties.isError && (
              <button
                type="button"
                className="text-sm text-destructive underline"
                onClick={() => void properties.refetch()}
              >
                Retry properties
              </button>
            )}
          </div>
          <div className="w-full space-y-1 sm:w-44">
            <GenericSelect
              label="Assigned admin"
              placeholder={
                admins.isPending ? "Loading admins..." : "All admins"
              }
              disabled={admins.isPending || admins.isError}
              value={query.assigned_to_admin_id}
              options={
                admins.data?.data.map((item) => ({
                  value: String(item.id),
                  label: item.name,
                })) ?? []
              }
              onValueChange={(assigned_to_admin_id) =>
                setQuery({ assigned_to_admin_id, pageIndex: 0 })
              }
            />
            {admins.isError && (
              <button
                type="button"
                className="text-sm text-destructive underline"
                onClick={() => void admins.refetch()}
              >
                Retry admins
              </button>
            )}
          </div>
          <GenericSelect
            className="w-full sm:w-44"
            label="Activities"
            placeholder="All"
            value={query.include_activities === null ? null : String(query.include_activities)}
            options={[
              { value: "true", label: "Activities included" },
              { value: "false", label: "Activities excluded" },
            ]}
            onValueChange={(value) =>
              setQuery({ include_activities: value === null ? null : value === "true", pageIndex: 0 })
            }
          />
        </CardHeader>
        <CardContent>
          <InquiryTable
            query={query}
            setQuery={setQuery}
          />
        </CardContent>
      </Card>
    </div>
  );
}
