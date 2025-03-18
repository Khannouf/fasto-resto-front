import { ColumnDef } from "@tanstack/react-table";
import { Categorie, TablesRestaurant } from "../../../types/type";
import { Button } from "../../ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

const idResto = 1;

export const columns = (
  deleteCategory: (id: number) => void
): ColumnDef<TablesRestaurant>[] => [
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
      );
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
      );
    },
  },
  {
    accessorKey: "qrCode",
    header: "QrCode",
    cell: ({ row }) => {
      const cat = row.original;

      return (
        <Link to={`/admin/tables/qrcode/${idResto}/${cat.numeroTable}`} target="_blank">
          <button className="bg-black text-white font-semibold"> Générer</button>
        </Link>
      )

      //bouton qui affiche le qrcode generator
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const cat = row.original;

      return (
        <button onClick={() => deleteCategory(cat.id)} className="bg-white ">
          {" "}
          <Trash className="text-red-500 " />
        </button>
      );
    },
  },
];
