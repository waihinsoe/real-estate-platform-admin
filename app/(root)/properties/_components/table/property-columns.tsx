"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { Property } from "@/types/property";
import { dataTableFeatures } from "@/components/tanstack-table/table-config";
import { SortableColumnHeader } from "@/components/tanstack-table/columns/sortable-column-header";
import { Badge } from "@/components/ui/badge";
import { PropertyStatusUpdateSelect } from "@/components/tanstack-table/cells/select/property-status-update-select";
import { PropertyActionMenu } from "./property-action-menu";
import { ImageLightbox } from "@/components/image/image-lightbox";
import { TruncateCell } from "@/components/tanstack-table/cells/display/truncate-cell";

const helper = createColumnHelper<typeof dataTableFeatures, Property>();

const listingTypeBadgeVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  SALE: "default",
  RENT: "secondary",
};

export const propertyColumns = helper.columns([
  helper.accessor("id", {
    header: ({ column }) => <SortableColumnHeader name="ID" column={column} />,
    cell: (info) => info.getValue(),
  }),
  helper.accessor("code", {
    header: ({ column }) => (
      <SortableColumnHeader name="Code" column={column} />
    ),
    cell: (info) => info.getValue(),
  }),
  helper.accessor("title", {
    header: ({ column }) => (
      <SortableColumnHeader name="Title" column={column} />
    ),
    cell: (info) => <TruncateCell className="w-full" value={info.getValue()} />,
  }),
  helper.accessor("images", {
    header: "Images",
    enableSorting: false,
    cell: ({ row, getValue }) => (
      <ImageLightbox
        label={row.original.title}
        images={[...(getValue() ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((image, index) => ({
            src: image.image_url,
            alt: `${row.original.title} image ${index + 1}`,
          }))}
      />
    ),
  }),
  helper.accessor("listing_type", {
    header: "Listing",
    enableSorting: false,
    cell: (info) => (
      <Badge variant={listingTypeBadgeVariant[info.getValue()] ?? "secondary"}>
        {info.getValue()}
      </Badge>
    ),
  }),
  helper.accessor("property_type", {
    header: "Type",
    enableSorting: false,
    cell: (info) => info.getValue(),
  }),
  helper.accessor("status", {
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <PropertyStatusUpdateSelect property={row.original} />,
  }),
  helper.accessor("price_lakhs", {
    header: ({ column }) => (
      <SortableColumnHeader name="Price" column={column} />
    ),
    cell: (info) => {
      const val = Number(info.getValue());
      return isNaN(val) ? info.getValue() : `${val.toLocaleString()} Lakhs`;
    },
  }),
  helper.accessor("region", {
    header: "Region",
    enableSorting: false,
    cell: (info) => info.getValue().name_en,
  }),
  helper.accessor("township", {
    header: "Township",
    enableSorting: false,
    cell: (info) => info.getValue().name_en,
  }),
  helper.accessor("is_featured", {
    header: "Featured",
    enableSorting: false,
    cell: (info) => (
      <Badge variant={info.getValue() ? "default" : "outline"}>
        {info.getValue() ? "Yes" : "No"}
      </Badge>
    ),
  }),
  helper.accessor("view_count", {
    header: ({ column }) => (
      <SortableColumnHeader name="Views" column={column} />
    ),
    cell: (info) => info.getValue().toLocaleString(),
  }),
  // helper.accessor("created_at", {
  //   header: ({ column }) => (
  //     <SortableColumnHeader name="Created" column={column} />
  //   ),
  //   cell: (info) =>
  //     new Date(info.getValue()).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     }),
  // }),
  // helper.accessor("updated_at", {
  //   header: ({ column }) => (
  //     <SortableColumnHeader name="Updated" column={column} />
  //   ),
  //   cell: (info) =>
  //     new Date(info.getValue()).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     }),
  // }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <PropertyActionMenu item={row.original} />,
  }),
]);
