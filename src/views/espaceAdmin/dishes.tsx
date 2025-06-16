import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import { CardDishes } from '../../components/cardDishes';
import { useUserContext } from '../../context/userContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { columns } from '../../components/table/tableDish/columns';
import { DataTable } from '../../components/ui/data-table';
import { useToast } from "../../hooks/use-toast"; // Import du hook


const api = import.meta.env.VITE_API_URL

export const Dishes = () => {
    const queryClient = useQueryClient()
    const { user } = useUserContext();
    const token = user?.token
    const restaurantId = user?.restaurantId;
    const [showCard, setShowCard] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const { toast } = useToast(); // Hook pour afficher le toast

    const handleSuccessToast = () => {
      toast({
        title: "Success",
        description: "Plat ajouté avec succès",
        variant: "success", // Peut aussi être 'error', 'info', etc.
        duration: 3000, // Durée du toast en ms
      });
      
    };


    const deleteDishMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${api}/dishes/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Échec de la suppression");
            }

            return await response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries(["dish", restaurantId]); // Force le refetch
            toast({
              title: "Succès",
              description: "Plat supprimé avec succès !",
              variant: "destructive", // Type "success"
              duration: 1000, // Durée en ms
              className: "bg-red-700 text-white p-4 rounded-lg shadow-lg font-semibold", // Classes Tailwind
            });
        },

        onError: (error) => {
            console.error("Erreur lors de la suppression :", error);
            alert("Impossible de supprimer la catégorie.");
        },
    });


    const deleteDish = (id: number) => {
        deleteDishMutation.mutate(id)
    };


    const getCategories = async (idRestaurant: number) => {
        const response = await fetch(`${api}/categorie/restaurant/${idRestaurant}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des plats");
        }
        return response.json();
    };

    const getDishes = async (idRestaurant: number) => {
        const response = await fetch(`${api}/dishes/allByRestaurant/${idRestaurant}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des plats");
        }
        return response.json();
    };

    const { data: dataDish, isLoading, isError } = useQuery({
        queryKey: ['dish', restaurantId],
        queryFn: () => getDishes(restaurantId!),
        enabled: !!restaurantId
    });
    /*if (dataDish){
        const { data: dataCategories } = useQuery({
            queryKey: ['categories', restaurantId],
            queryFn: () => getCategories(restaurantId!),
            enabled: !!restaurantId
        });

    }*/



    return (
        <>
            <div className="h-screen flex flex-col w-[80vw]">
                <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
                    Plats
                </h1>
                <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center px-5 gap-2 mb-3">
                    <button
                        className="text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                        onClick={() => setShowCard(true)}
                    >
                        <CirclePlus />
                        Nouvelle Plats
                    </button>
                    <div className="flex items-center">
                        <label className="text-sm font-medium text-gray-700 mr-2">
                            Afficher
                        </label>
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
                    {isLoading ? (
                        <p>Chargement des plats...</p>
                    ) : isError ? (
                        <p>Erreur lors du chargement des plats.</p>
                    ) : (
                        <DataTable columns={columns(deleteDish)} data={dataDish.data || []} pageSize={pageSize} />
                    )}
                </div>
            </div>

            {showCard && <CardDishes onClose={() => setShowCard(false)} />}
        </>


        // <>
        //     <div className="h-screen flex flex-col ">
        //         <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
        //             Plats
        //         </h1>
        //         <button
        //         className="text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
        //         onClick={() => setShowCard(true)}
        //       >
        //         <CirclePlus />
        //         Nouvelle catégorie
        //       </button>
        //         {/* Sélecteur de taille de page */}
        //         <div className="flex items-center mt-3 ml-5">
        //             <label className="text-sm font-medium text-gray-700 mr-2">Afficher</label>
        //             <select
        //                 value={pageSize}
        //                 onChange={(e) => setPageSize(Number(e.target.value))}
        //                 className="border rounded p-1 text-sm bg-white"
        //             >
        //                 <option value={10}>10</option>
        //                 <option value={25}>25</option>
        //                 <option value={50}>50</option>
        //                 <option value={100}>100</option>
        //             </select>
        //             <span className="text-sm text-gray-700 ml-2">éléments</span>
        //         </div>

        //         {/* Table */}
        //         <div className="ml-5 rounded-lg bg-[#ffffff] flex-1 p-5 lg:w-[90vw] md:w-[50vw]">
        //             {isLoading ? (
        //                 <p>Chargement des plats...</p>
        //             ) : isError ? (
        //                 <p>Erreur lors du chargement des plats.</p>
        //             ) : (
        //                 <DataTable columns={columns(deleteDish)} data={dataDish.data || []} pageSize={pageSize} />
        //             )}
        //         </div>
        //     </div>

        //     {/* Fenêtre modale pour ajouter un plat */}
        //     {showCard && <CardDishes onClose={() => setShowCard(false)} />}
        // </>
    );
};
