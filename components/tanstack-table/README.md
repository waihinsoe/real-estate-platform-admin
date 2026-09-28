# Table components

These components use TanStack Table v9 and expect data that is already sorted
and paginated by the server.

- `table-config.ts` registers the shared features and exports `DataTableColumnDef`.
- `data-table.tsx` owns table setup, rendering, loading/empty states, and pagination controls.
- `search-params-table.tsx` translates URL query values and updates into `DataTable` props.
- `sortable-column-header.tsx` uses the column's sorting handler.
- `data-table-pagination.tsx` renders navigation controls without depending on TanStack types.
- `action-menu.tsx` remains an application-specific placeholder.

## Defining columns

Use the shared feature type when authoring columns. The v9 column helper retains
the value type inside each accessor's callbacks, and `helper.columns` combines
columns with different value types into an array accepted by the table.

```tsx
"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { dataTableFeatures } from "@/components/tanstack-table/table-config";
import { SortableColumnHeader } from "@/components/tanstack-table/sortable-column-header";

type AdminUser = { id: number; name: string };

const helper = createColumnHelper<typeof dataTableFeatures, AdminUser>();

export const columns = helper.columns([
  helper.accessor("id", { header: "ID" }),
  helper.accessor("name", {
    header: ({ column }) => (
      <SortableColumnHeader name="Name" column={column} />
    ),
    cell: (info) => info.getValue(),
  }),
]);
```

For simple definitions, `DataTableColumnDef<AdminUser>[]` is also available.
Both table components infer the row type from their `data` and `columns` props;
they do not need a table-wide `TValue` generic.

## State ownership

Pass `sorting`/`setSorting` and `pagination`/`setPagination` to `DataTable`.
Callbacks accept either a new value or an updater function, as in TanStack v9.
The caller fetches rows whenever its controlled state changes. `DataTable`
does not sort or slice the returned server page in the browser.

`SearchParamsTable` accepts `query` and `setQuery` instead. It keeps page indices
zero-based, resets the page index to zero when sorting changes, and always keeps
one sort active. Column IDs used for sorting must match the API's `sort_by` keys.

## References

- [React v9 migration](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)
- [Features](https://tanstack.com/table/latest/docs/guide/features)
- [Controlled state](https://tanstack.com/table/latest/docs/framework/react/guide/table-state)
- [Server pagination](https://tanstack.com/table/latest/docs/framework/react/guide/pagination)
