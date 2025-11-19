"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

interface RowComponentProps extends React.HTMLAttributes<HTMLTableRowElement> {
  id: string;
}

type RowComponentType = React.ComponentType<RowComponentProps> | "tr";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  customRowComponent?: RowComponentType
}

export function DataTable<TData, TValue>({
  columns,
  data,
  customRowComponent: RowComponent = "tr" as RowComponentType, // Default to standard tr
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="h-12 px-4 text-left align-middle font-medium text-gray-600"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              // If using a custom row component (like SortableRow), pass the necessary props
              // For SortableRow, we expect the row ID as 'id'
              const isCustomComponent = typeof RowComponent !== "string";

              if (isCustomComponent) {
                const CustomRow = RowComponent as React.ComponentType<RowComponentProps>;
                return (
                  <CustomRow
                    key={row.id}
                    id={(row.original as TData & { id: string }).id}
                    className="border-b transition-colors hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </CustomRow>
                );
              }

              // Default tr rendering
              return (
                <tr
                  key={row.id}
                  className="border-b transition-colors hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                無裝備資料
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
