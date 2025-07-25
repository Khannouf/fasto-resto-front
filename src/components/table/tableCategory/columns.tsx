import { ColumnDef } from "@tanstack/react-table"
import { Categorie } from "../../../types/type"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { Button } from "../../ui/button"
import { MoreHorizontal, Trash } from "lucide-react"
import { ArrowUpDown } from "lucide-react"



export const columns = (deleteCategory: (id: number) => void): ColumnDef<Categorie>[] => [
    {
        accessorKey: "id",
        meta: {
            label: "id"
        },
        header: ({ column }) => {
            return (
                <button
                    className="bg-white text-black flex flex-row"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Id
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "name",
        meta: {
            label: "Nom"
        },
        header: ({ column }) => {
            return (
                <button
                    className="bg-white text-black flex flex-row"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        id: "action",
        cell: ({ row }) => {

            const cat = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 bg-white">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuItem
                            onClick={() => deleteCategory(cat.id)}
                            className="justify-center"
                        >
                            <Trash className="text-red-500" />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )

        },
    },
]