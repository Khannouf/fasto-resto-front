import {
    ColumnDef,
    flexRender,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    VisibilityState,
    useReactTable,
    ColumnFiltersState,
} from "@tanstack/react-table"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table"
import React, { useEffect, useState } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageSize: number
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageSize,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // 🆕 ajout du filtre par colonne

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // 🆕 nécessaire pour les filtres
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters, // 🆕 handler
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
            columnVisibility,
            columnFilters, // 🆕 state
        },
    });

    useEffect(() => {
        table.setPageSize(pageSize);
    }, [pageSize, table]);

    return (
        <div>
            {/* 🔍 Recherche globale */}
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Rechercher dans tous les champs..."
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Colonnes
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {typeof column.columnDef.header === "string"
                                    ? column.columnDef.header
                                    : column.columnDef.meta?.label || column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 💡 Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : (
                                                <div className="space-y-1">
                                                    {/* En-tête */}
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {/* 🔍 Input de filtre colonne */}
                                                    {header.column.getCanFilter() && (
                                                        <Input
                                                            type="text"
                                                            value={(header.column.getFilterValue() ?? "") as string}
                                                            onChange={(e) => header.column.setFilterValue(e.target.value)}
                                                            placeholder="Filtrer..."
                                                            className="h-8 w-full text-sm"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucun résultat trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 📦 Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Précédent
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
}