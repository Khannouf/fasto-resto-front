import { ColumnDef } from "@tanstack/react-table"
import { orderType } from "../../../types/type"
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { Button } from "../../ui/button"
import { useState } from "react"
import { CardUpdateOrder } from "../../cardUpdate/cardUpdateOrder"

export const columns = (deleteOrder: (id: number) => void, updateStateOrder: (id: number, state: string, action: string) => void): ColumnDef<orderType>[] => [
    {
        accessorKey: "id",
        meta: {
            label: "Id"
        },
        header: ({ column }) => (
            <button
                className="w-full bg-white text-black flex justify-center items-center py-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Id
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => <span className="text-sm">{row.getValue("id")}</span>,
    },
    {
        accessorKey: "sequentialId",
        meta: {
            label: "Numéro de commande"
        },
        header: ({ column }) => (
            <button
                className="w-full bg-white text-black flex justify-center items-center py-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Numéro de commande
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => <span className="text-sm">{row.getValue("sequentialId")}</span>,
    },
    {
        accessorKey: "state",
        meta: {
            label: "Etat"
        },
        header: ({ column }) => (
            <button
                className="w-full bg-white text-black flex justify-center items-center py-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                État
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => {
            const state: string = row.getValue("state")
            const badgeClass =
                state === "a payer"
                    ? "bg-yellow-100 text-yellow-800"
                    : state === "en préparation"
                        ? "bg-blue-100 text-blue-800"
                        : state === "prête"
                            ? "bg-green-100 text-green-800"
                            : state === "rendu"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"

            return (
                <span className={`text-sm font-semibold py-1 px-3 rounded-full ${badgeClass}`}>
                    {state.toUpperCase()}
                </span>
            )
        },
    },
    {
        accessorKey: "orderJoin",
        meta: {
            label: "Détail de la commande"
        },
        header: "Détails de la commande",
        cell: ({ row }) => {
            const orderJoin = row.original.orderJoin;
            return (
                <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="font-bold text-sm mb-2">Plats :</h3>
                    <ul className="mb-2">
                        {orderJoin
                            .filter((join) => join.dish)
                            .map((join) => (
                                <li
                                    key={join.orderJoinId}
                                    className="text-sm text-gray-700 py-1 border-b last:border-none"
                                >
                                    {join.dish.name} - {join.nbElement} x {join.dish.price} €
                                </li>
                            ))}
                    </ul>
                    <h3 className="font-bold text-sm mb-2">Menus :</h3>
                    <ul>
                        {orderJoin
                            .filter((join) => join.menu)
                            .map((join) => (
                                <li
                                    key={join.orderJoinId}
                                    className="text-sm text-gray-700 py-1 border-b last:border-none"
                                >
                                    {join.menu.name} - {join.nbElement} x {join.menu.price} €
                                </li>
                            ))}
                    </ul>
                </div>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            const joins = row.original.orderJoin;
            const textContent = joins
                .map((join) =>
                    join.dish
                        ? join.dish.name
                        : join.menu
                            ? join.menu.name
                            : ""
                )
                .join(" ")
                .toLowerCase();
            return textContent.includes(filterValue.toLowerCase());
        },
    },
    {
        accessorKey: "total",
        meta: {
            label: "Total"
        },
        id: "total",
        header: ({ column }) => (
            <button
                className="w-full bg-white text-black flex justify-center items-center py-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Total
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => {
            const total: number = row.getValue("total");
            return <span className="text-sm font-medium">{total.toFixed(2)} €</span>;
        },
        sortingFn: "alphanumeric",
        filterFn: (row, columnId, filterValue) => {
            const value = row.getValue<number>(columnId);
            return value.toFixed(2).includes(filterValue);
        },
    },
    {
        accessorKey: "tableId",
        meta: {
            label: "Table"
        },
        header: ({ column }) => (
            <button
                className="w-full bg-white text-black flex justify-center items-center py-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Table
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => <span className="text-sm">{row.getValue("tableId")}</span>,
        filterFn: "includesString",
    },
    {
        accessorFn: (row) => {
            const raw = new Date(row.createdAt)
            const formatted = raw.toLocaleDateString("fr-FR")
            return { raw, formatted }
        },
        id: "createdAt",
        meta: {
            label: "Date de création"
        },
        header: ({ column }) => (
            <button
                className="w-full bg-white text-black flex justify-center items-center py-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date de création
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ getValue }) => {
            const { formatted } = getValue<{ raw: Date; formatted: string }>()
            return <span className="text-sm">{formatted}</span>
        },
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = rowA.getValue<{ raw: Date }>(columnId).raw
            const dateB = rowB.getValue<{ raw: Date }>(columnId).raw
            return dateA > dateB ? 1 : dateA < dateB ? -1 : 0
        },
        filterFn: (row, columnId, filterValue) => {
            const { formatted } = row.getValue<{ formatted: string }>(columnId)
            return formatted.includes(filterValue)
        },
    },
    {
        id: "action",
        cell: ({ row }) => {

            const cat = row.original

            const [showCard, setShowCard] = useState(false);

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 bg-white">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                            <DropdownMenuItem
                                onClick={() => deleteOrder(cat.id)}
                                className="justify-center"
                            >
                                <Trash className="text-red-500" />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {cat.state === "fini" ? (
                                <>
                                    <DropdownMenuItem onClick={() => updateStateOrder(cat.id, cat.state, "downgrade")}>Passer la commande à l'état précedente</DropdownMenuItem></>
                            ) : cat.state === "a payer" ? (
                                <>
                                    <DropdownMenuItem onClick={() => updateStateOrder(cat.id, cat.state, "upgrade")}>Passer la commande à l'état suivant</DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={() => updateStateOrder(cat.id, cat.state, "upgrade")}>Passer la commande à l'état suivant</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateStateOrder(cat.id, cat.state, "downgrade")}>Passer la commande à l'état précedente</DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuItem onClick={() => setShowCard(true)}>
                                Modifier la commande
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {showCard && (
                        <CardUpdateOrder
                            orderId={row.original.id} // Passe l'ID de la commande
                            onClose={() => setShowCard(false)} // Ferme la carte
                        />
                    )}
                </>
            )

        },
    },
]
