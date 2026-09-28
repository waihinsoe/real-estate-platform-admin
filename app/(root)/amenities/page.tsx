"use client";

import {
  useQueryStates,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { AmenityTable } from "./_components/table/amenity-table";
import PageHeading from "@/components/layout/page-heading";
import { DebounceInput } from "@/components/input/debounce-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GenericFormDialog from "@/components/dialog/generic-form-dialog";
import { CreateAmenityForm } from "./_components/form/create-amenity-form";
import { Plus } from "lucide-react";

export const AMENITY_SORTABLE_FIELDS = [
  "id",
  "name",
  "slug",
] as const;

const PAGE_SIZE = 10;

export default function AmenitiesPage() {
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(""),
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(PAGE_SIZE),
    sort_by: parseAsStringLiteral(AMENITY_SORTABLE_FIELDS).withDefault("id"),
    sort_direction: parseAsStringLiteral(["asc", "desc"]).withDefault("asc"),
  });

  return (
    <div className="flex flex-col gap-3 p-4">
      <Card>
        <CardContent>
          <PageHeading heading="Amenities" />
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
            placeholder="Search amenities…"
          />
          <GenericFormDialog
            title="Add Amenity"
            contentClassName="max-h-[calc(100dvh-2rem)] overflow-y-auto"
            trigger={
              <Button
                type="button"
                className="w-full sm:ml-auto sm:w-auto sm:shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add Amenity
              </Button>
            }
          >
            {({ setOpen }) => (
              <CreateAmenityForm onClose={() => setOpen(false)} />
            )}
          </GenericFormDialog>
        </CardHeader>
        <CardContent>
          <AmenityTable query={query} setQuery={setQuery} />
        </CardContent>
      </Card>
    </div>
  );
}
