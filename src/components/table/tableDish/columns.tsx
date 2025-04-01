import { ColumnDef } from "@tanstack/react-table";
import { Dish, TablesRestaurant } from "../../../types/type";
import { Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

const idResto = 1;

export const columns = (
    deleteCategory: (id: number) => void
): ColumnDef<Dish>[] => [
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
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <button
                        className="bg-white text-black flex flex-row"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nom
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                );
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <button
                        className="bg-white text-black flex flex-row"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Prix
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                );
            },
        },
        {
            accessorKey: "categorieId",
            header: ({ column }) => {
                return (
                    <button
                        className="bg-white text-black flex flex-row"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Categorie
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                );
            },
        },
        {
            accessorKey: "description",
            header: ({ column }) => {
                return (
                    <button
                        className="bg-white text-black flex flex-row"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Description
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                );
            },
        },
        {
            id: "imageUrl",
            header: ({ column }) => {
                return (

                    <>
                        Image
                    </>
                );
            },
            cell: ({ row }) => {
                const cat = row.original;
                return (
                    <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                        <img
                            src={cat.imageUrl}
                            alt="Image"
                            className="w-full h-full object-cover"
                        />
                    </div>
                );
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
