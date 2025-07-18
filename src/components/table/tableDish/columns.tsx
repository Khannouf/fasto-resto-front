import { ColumnDef } from "@tanstack/react-table";
import { Dish, TablesRestaurant } from "../../../types/type";
import { Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

const idResto = 1;

export const columns = (
    deleteDish: (id: number) => void
): ColumnDef<Dish>[] => [
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
                );
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
                );
            },
        },
        {
            accessorKey: "price",
            meta: {
                label: "prix"
            },
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
            meta: {
                label: "Catégorie"
            },
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
            meta: {
                label: "description"
            },
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
            id: "Ingredients",
            meta: {
                label: "Ingrédients"
            },
            header: ({ column }) => {
                return (

                    <>
                        Ingredients
                    </>
                );
            },
            cell: ({ row }) => {
                const cat = row.original;
                const ingredients = cat.dishIngredients

                return (
                    <ul className="bg-gray-50 rounded-md p-2">
                        {ingredients.map((ingredient) => (
                            <li
                                key={ingredient.ingredientId}
                                className="text-sm text-gray-700 py-1 border-b last:border-none"
                            >
                                {ingredient.quantity} x {ingredient.ingredient.name}
                            </li>
                        ))}
                    </ul>


                );
            },
        },
        {
            id: "imageUrl",
            meta: {
                label: "Image"
            },
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
                    <button onClick={() => deleteDish(cat.id)} className="bg-white ">
                        {" "}
                        <Trash className="text-red-500 " />
                    </button>
                );
            },
        },
    ];
