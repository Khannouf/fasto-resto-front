import { ColumnDef } from "@tanstack/react-table"
import { Categorie, TablesRestaurant } from "../../../types/type"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { Button } from "../../ui/button"
import { MoreHorizontal, Trash } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { QRCodeGenerator } from "../../qrCodeGenerator"



export const columns = (deleteCategory: (id: number) => void): ColumnDef<TablesRestaurant>[] => [
    {
        accessorKey: "id",
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
        accessorKey: "numeroTable",
        header: ({ column }) => {
            return (
                <button
                    className="bg-white text-black flex flex-row"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Numéro de table
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "qrCode",
        header: "QrCode",
        cell: ({ row }) => {
            const cat = row.original;

            //bouton qui affiche le qrcode generator
        }

    },
    {
        id: "action",
        cell: ({ row }) => {

            const cat = row.original

            return (
                <button onClick={() => deleteCategory(cat.id)}
                    className="bg-white "> <Trash className="text-red-500 " /></button>
            )

        },
    },
]