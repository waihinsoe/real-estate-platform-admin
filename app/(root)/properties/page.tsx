"use client";

import {
  useQueryStates,
  parseAsInteger,
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { PropertyTable } from "./_components/table/property-table";
import PageHeading from "@/components/layout/page-heading";
import { DebounceInput } from "@/components/input/debounce-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GenericSelect } from "@/components/native-select/generic-select";
import { RegionSelect } from "@/components/native-select/region-select";
import { TownshipSelect } from "@/components/native-select/township-select";
import Link from "next/link";
import type { PropertySortableField } from "@/types/property";

export const PROPERTY_SORTABLE_FIELDS = [
  "id",
  "code",
  "title",
  "price_lakhs",
  "view_count",
  "created_at",
  "updated_at",
] as const satisfies readonly PropertySortableField[];

const LISTING_TYPES = ["SALE", "RENT"] as const;
const PROPERTY_TYPES = [
  "LAND",
  "HOUSE",
  "CONDO",
  "APARTMENT",
  "SHOP",
  "OFFICE",
  "WAREHOUSE",
] as const;
const STATUSES = ["DRAFT", "PUBLISHED", "SOLD", "RENTED", "HIDDEN"] as const;

const PAGE_SIZE = 10;

export default function PropertiesPage() {
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(""),
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(PAGE_SIZE),
    region_id: parseAsString,
    township_id: parseAsString,
    listing_type: parseAsStringLiteral(LISTING_TYPES),
    property_type: parseAsStringLiteral(PROPERTY_TYPES),
    status: parseAsStringLiteral(STATUSES),
    is_featured: parseAsBoolean,
    sort_by: parseAsStringLiteral(PROPERTY_SORTABLE_FIELDS).withDefault("id"),
    sort_direction: parseAsStringLiteral(["asc", "desc"]).withDefault("asc"),
  });

  return (
    <div className="flex flex-col gap-3 p-4">
      <Card>
        <CardContent>
          <PageHeading heading="Properties" />
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
            placeholder="Search by title…"
          />
          <RegionSelect
            className="w-full sm:w-40"
            aria-label="Region"
            allLabel="All regions"
            value={query.region_id ?? "0"}
            onChange={(event) =>
              setQuery({
                region_id: event.target.value === "0" ? null : event.target.value,
                township_id: null,
                pageIndex: 0,
              })
            }
          />
          <TownshipSelect
            className="w-full sm:w-40"
            aria-label="Township"
            allLabel="All townships"
            regionId={query.region_id ? Number(query.region_id) : undefined}
            value={query.township_id ?? "0"}
            onChange={(event) =>
              setQuery({
                township_id: event.target.value === "0" ? null : event.target.value,
                pageIndex: 0,
              })
            }
          />
          <GenericSelect
            className="w-full sm:w-40"
            label="Listing type"
            placeholder="All types"
            options={[
              { value: "SALE", label: "Sale" },
              { value: "RENT", label: "Rent" },
            ]}
            value={query.listing_type}
            onValueChange={(listing_type) =>
              setQuery({ listing_type, pageIndex: 0 })
            }
          />
          <GenericSelect
            className="w-full sm:w-40"
            label="Property type"
            placeholder="All property types"
            options={PROPERTY_TYPES.map((t) => ({
              value: t,
              label: t.charAt(0) + t.slice(1).toLowerCase(),
            }))}
            value={query.property_type}
            onValueChange={(property_type) =>
              setQuery({ property_type, pageIndex: 0 })
            }
          />
          <GenericSelect
            className="w-full sm:w-40"
            label="Status"
            placeholder="All statuses"
            options={STATUSES.map((s) => ({
              value: s,
              label: s.charAt(0) + s.slice(1).toLowerCase(),
            }))}
            value={query.status}
            onValueChange={(status) => setQuery({ status, pageIndex: 0 })}
          />
          <GenericSelect
            className="w-full sm:w-40"
            label="Featured"
            placeholder="All"
            options={[
              { value: "true", label: "Featured" },
              { value: "false", label: "Not featured" },
            ]}
            value={
              query.is_featured === null
                ? null
                : query.is_featured
                  ? "true"
                  : "false"
            }
            onValueChange={(value) =>
              setQuery({
                is_featured: value === null ? null : value === "true",
                pageIndex: 0,
              })
            }
          />
          <Link
            href="/properties/create"
            className="w-full sm:ml-auto sm:w-auto sm:shrink-0"
          >
            <Button type="button" className="w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <PropertyTable query={query} setQuery={setQuery} />
        </CardContent>
      </Card>
    </div>
  );
}
