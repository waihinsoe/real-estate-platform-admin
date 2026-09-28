"use client";

import {
  useQueryStates,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { TownshipTable } from "./_components/table/township-table";
import PageHeading from "@/components/layout/page-heading";
import { DebounceInput } from "@/components/input/debounce-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GenericFormDialog from "@/components/dialog/generic-form-dialog";
import { CreateTownshipForm } from "./_components/form/create-township-form";
import { Plus } from "lucide-react";
import { RegionSelect } from "@/components/native-select/region-select";

export const TOWNSHIP_SORTABLE_FIELDS = [
  "id",
  "name_en",
  "name_mm",
  "slug",
  "region_id",
] as const;

const PAGE_SIZE = 10;

export default function TownshipsPage() {
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(""),
    region_id: parseAsString,
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(PAGE_SIZE),
    sort_by: parseAsStringLiteral(TOWNSHIP_SORTABLE_FIELDS).withDefault("id"),
    sort_direction: parseAsStringLiteral(["asc", "desc"]).withDefault("asc"),
  });

  return (
    <div className="flex flex-col gap-3 p-4">
      <Card>
        <CardContent>
          <PageHeading heading="Townships" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center">
          <DebounceInput
            className="min-w-0 sm:flex-1"
            value={query.search}
            onDebouncedChange={(value) =>
              setQuery({ search: value, pageIndex: 0 })
            }
            placeholder="Search townships…"
          />
          <RegionSelect
            className="w-full sm:w-48"
            aria-label="Region"
            allLabel="All regions"
            value={query.region_id ?? "0"}
            onChange={(event) =>
              setQuery({
                region_id: event.target.value === "0" ? null : event.target.value,
                pageIndex: 0,
              })
            }
          />
          <GenericFormDialog
            title="Add Township"
            contentClassName="max-h-[calc(100dvh-2rem)] overflow-y-auto"
            trigger={
              <Button
                type="button"
                className="w-full sm:ml-auto sm:w-auto sm:shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add Township
              </Button>
            }
          >
            {({ setOpen }) => (
              <CreateTownshipForm onClose={() => setOpen(false)} />
            )}
          </GenericFormDialog>
        </CardHeader>
        <CardContent>
          <TownshipTable query={query} setQuery={setQuery} />
        </CardContent>
      </Card>
    </div>
  );
}
