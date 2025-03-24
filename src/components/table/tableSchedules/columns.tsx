import { ColumnDef } from "@tanstack/react-table";
import { ScheduleDayRow } from "../../../types/type";
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../../ui/button";

export const columns: ColumnDef<ScheduleDayRow>[] = [
  {
    accessorKey: "day",
    header: ({ column }) => (
      <button
        className="bg-white text-black flex flex-row"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Jour
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    accessorKey: "start",
    header: "Heure de début",
  },
  {
    accessorKey: "end",
    header: "Heure de fin",
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
                        // onClick={() => deleteCategory(cat.id)}
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
}
];
