import React, { useState } from 'react';
import { Categorie } from '../../types/type';
import { CirclePlus } from 'lucide-react';
import { CardCategory } from '../../components/cardCategory';
import { DataTable } from '../../components/ui/data-table';
import { columns } from '../../components/table/tableCategory/columns';

export const Category = () => {
    const [showCard, setShowCard] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [categories, setCategories] = useState<Categorie[]>([
        { id: 1, name: "Plats" },
        { id: 2, name: "Boissons" },
        { id: 3, name: "Desserts" },
        { id: 4, name: "Tex-Mex" },
        { id: 5, name: "Salades" },
        { id: 6, name: "Viandes" },
        { id: 7, name: "Fruits" },
        { id: 8, name: "Soupes" },
        { id: 9, name: "Poissons" },
        { id: 10, name: "Pâtes" },
        { id: 11, name: "Fast Food" },
        { id: 12, name: "Asiatique" },
    ]);

    const deleteCategory = (id: number) => {
        setCategories((prev) => prev.filter(category => category.id !== id));
    };

    return (
        <>
            <div className="h-screen flex flex-col w-[80vw]">
                <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
                    Catégorie
                </h1>
                <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center px-5 gap-2 mb-3">
                    <button
                        className="text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                        onClick={() => setShowCard(true)}
                    >
                        <CirclePlus />
                        Nouvelle catégorie
                    </button>
                    <div className="flex items-center">
                        <label className="text-sm font-medium text-gray-700 mr-2">Afficher</label>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="border rounded p-1 text-sm bg-white"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-700 ml-2">éléments</span>
                    </div>

                </div>

                {/* Table */}
                <div className="ml-5 rounded-lg bg-[#ffffff] flex-1 p-5 lg:w-[90vw] md:w-[50vw]">
                    <DataTable columns={columns(deleteCategory)} data={categories} pageSize={pageSize} />
                </div>
            </div>

            {showCard && <CardCategory onClose={() => setShowCard(false)} />}
        </>
    );
}
