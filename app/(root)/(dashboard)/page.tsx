"use client";

import Link from "next/link";
import { ArrowRight, Building2, CircleCheck, Map, MapPin, Plus } from "lucide-react";
import PageHeading from "@/components/layout/page-heading";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProperties } from "@/hooks/use-properties";
import { useRegions } from "@/hooks/use-regions";
import { useTownships } from "@/hooks/use-townships";
import type { PropertyStatus } from "@/types/property";
import {
  EmptyState,
  QueryContent,
  SummaryCard,
} from "./_components/dashboard-widgets";

const statuses = [
  { value: "PUBLISHED", label: "Published", color: "bg-emerald-500" },
  { value: "DRAFT", label: "Draft", color: "bg-amber-500" },
  { value: "SOLD", label: "Sold", color: "bg-blue-500" },
  { value: "RENTED", label: "Rented", color: "bg-violet-500" },
  { value: "HIDDEN", label: "Hidden", color: "bg-slate-400" },
] satisfies { value: PropertyStatus; label: string; color: string }[];

function StatusRow({
  status,
  total,
}: {
  status: (typeof statuses)[number];
  total?: number;
}) {
  const query = useProperties({ page: 1, limit: 1, status: status.value });
  const count = query.data?.meta.total;
  const percentage = total && count !== undefined
    ? Math.min(100, (count / total) * 100)
    : 0;

  return (
    <div className="space-y-2">
      <Link
        href={`/properties?status=${status.value}`}
        className="flex items-center justify-between gap-3 hover:text-primary"
      >
        <span className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${status.color}`} aria-hidden="true" />
          {status.label}
        </span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
      <QueryContent query={query}>
        <div className="flex items-center gap-3">
          {total !== undefined && (
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div
                className={`h-full rounded-full ${status.color}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
          <span className="ml-auto text-sm font-medium tabular-nums">
            {count?.toLocaleString("en-US")}
          </span>
        </div>
      </QueryContent>
    </div>
  );
}

export default function DashboardPage() {
  const properties = useProperties({
    page: 1, limit: 6, sort_by: "created_at", sort_direction: "desc",
  });
  const published = useProperties({ page: 1, limit: 1, status: "PUBLISHED" });
  const regions = useRegions({
    page: 1, limit: 5, sort_by: "name_en", sort_direction: "asc",
  });
  const townships = useTownships({
    page: 1, limit: 5, sort_by: "name_en", sort_direction: "asc",
  });

  return (
    <div className="flex min-w-0 flex-col gap-4 p-4">
      <Card>
        <CardContent><PageHeading heading="Dashboard" /></CardContent>
      </Card>

      <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your properties and the locations they belong to.
          </p>
        </div>
        <Link href="/properties/create" className={buttonVariants()}>
          <Plus className="size-4" aria-hidden="true" /> Add Property
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total properties" description="View all properties" href="/properties" icon={Building2} query={properties} />
        <SummaryCard title="Published properties" description="View published listings" href="/properties?status=PUBLISHED" icon={CircleCheck} query={published} />
        <SummaryCard title="Regions" description="Manage regions" href="/regions" icon={Map} query={regions} />
        <SummaryCard title="Townships" description="Manage townships" href="/townships" icon={MapPin} query={townships} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader>
            <CardTitle><h2>Recent properties</h2></CardTitle>
            <CardDescription>Your six most recently created listings.</CardDescription>
            <CardAction>
              <Link href="/properties" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                View all <ArrowRight aria-hidden="true" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <QueryContent query={properties}>
              {!properties.data?.data.length ? (
                <EmptyState>No properties yet. Add your first property to get started.</EmptyState>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Listing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price (Lakhs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.data.data.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <Link
                            href={`/properties/${property.id}/edit`}
                            className="block max-w-64 truncate font-medium hover:text-primary hover:underline"
                            title={property.title}
                          >
                            {property.title}
                          </Link>
                          <p className="mt-1 max-w-64 truncate text-xs text-muted-foreground">
                            {[property.township?.name_en, property.region?.name_en].filter(Boolean).join(", ") || "Location unavailable"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{property.listing_type === "SALE" ? "Sale" : "Rent"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={property.status === "PUBLISHED" ? "default" : "outline"}>
                            {statuses.find((status) => status.value === property.status)?.label ?? property.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {Number.isFinite(Number(property.price_lakhs))
                            ? Number(property.price_lakhs).toLocaleString("en-US", { maximumFractionDigits: 2 })
                            : property.price_lakhs}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </QueryContent>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><h2>Property status</h2></CardTitle>
            <CardDescription>Listings across each stage. Select a status to view them.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {statuses.map((status) => (
              <StatusRow key={status.value} status={status} total={properties.isError ? undefined : properties.data?.meta.total} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle><h2>Regions</h2></CardTitle>
            <CardDescription>First five regions alphabetically. Select one to view its properties.</CardDescription>
            <CardAction>
              <Link href="/regions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Manage <ArrowRight aria-hidden="true" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <QueryContent query={regions}>
              {!regions.data?.data.length ? <EmptyState>No regions yet. Add a region from the Regions page.</EmptyState> : (
                <ul className="divide-y">
                  {regions.data.data.map((region) => (
                    <li key={region.id}>
                      <Link href={`/properties?region_id=${region.id}`} className="flex items-center gap-3 rounded-md py-3 hover:bg-muted/50">
                        <Map className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{region.name_en}</p>
                          <p className="truncate text-xs text-muted-foreground">{region.name_mm}</p>
                        </div>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </QueryContent>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><h2>Townships</h2></CardTitle>
            <CardDescription>First five townships alphabetically, with their property counts.</CardDescription>
            <CardAction>
              <Link href="/townships" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Manage <ArrowRight aria-hidden="true" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <QueryContent query={townships}>
              {!townships.data?.data.length ? <EmptyState>No townships yet. Add a township from the Townships page.</EmptyState> : (
                <ul className="divide-y">
                  {townships.data.data.map((township) => (
                    <li key={township.id}>
                      <Link href={`/properties?region_id=${township.region_id}&township_id=${township.id}`} className="flex items-center gap-3 rounded-md py-3 hover:bg-muted/50">
                        <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{township.name_en}</p>
                          <p className="truncate text-xs text-muted-foreground">{township.region?.name_en ?? township.name_mm}</p>
                        </div>
                        <Badge variant="secondary">{township._count?.properties?.toLocaleString("en-US") ?? "—"} properties</Badge>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </QueryContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
