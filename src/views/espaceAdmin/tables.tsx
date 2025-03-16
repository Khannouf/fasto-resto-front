import React, { useState } from 'react';
import { Categorie, TablesRestaurant } from '../../types/type';
import { CirclePlus } from 'lucide-react';
import { CardCategory } from '../../components/cardCategory';
import { DataTable } from '../../components/ui/data-table';
import { columns } from '../../components/table/tableTableRestaurant/columns';
import QRCodeGenerator from '../../components/qrCodeGenerator';

export const TablesView = () => {
    const [showCard, setShowCard] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [tables, setTables] = useState<TablesRestaurant[]>([
        { id: 1, numeroTable: "5" },
        { id: 2, numeroTable: "23" },
        { id: 3, numeroTable: "24" },
        { id: 4, numeroTable: "25" },
        { id: 5, numeroTable: "26" },
        { id: 6, numeroTable: "27" },
        { id: 7, numeroTable: "28" },
        { id: 8, numeroTable: "28" },
        { id: 9, numeroTable: "29" },
        { id: 10, numeroTable: "30" },
        { id: 11, numeroTable: "31" },
        { id: 12, numeroTable: "31" },
    ]);

    const deleteCategory = (id: number) => {
        setTables((prev) => prev.filter(tables => tables.id !== id));
    };

    return (
        <>
            <div className="h-screen flex flex-col w-[80vw]">
                <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
                    Tables
                </h1>
                <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center px-5 gap-2 mb-3">
                    <button
                        className="text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                        onClick={() => setShowCard(true)}
                    >
                        <CirclePlus />
                        Nouvelle tables
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
                    <DataTable columns={columns(deleteCategory)} data={tables} pageSize={pageSize} />
                </div>
            </div>
            <QRCodeGenerator idResto={1} tableId={1} />

            {showCard && <CardCategory onClose={() => setShowCard(false)} />}
        </>
    );
}
