import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "../../hooks/use-toast";
import { orderType, orderJoinType } from "../../types/type";
import { useUserContext } from "../../context/userContext";

const api = import.meta.env.VITE_API_URL;

interface CardUpdateOrderProps {
    orderId: number;
    onClose: () => void;
}

export const CardUpdateOrder: React.FC<CardUpdateOrderProps> = ({ orderId, onClose }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useUserContext();
    const token = user?.token
    const restaurantId = user?.restaurantId;

    // État pour stocker les données de la commande
    const [orderData, setOrderData] = useState<orderType | null>(null);
    const [orderJoin, setOrderJoin] = useState<orderJoinType[]>([]);

    // Fetch la commande par ID
    const { data, isLoading, isError } = useQuery({
        queryKey: ["order", orderId],
        queryFn: async () => {
            const response = await fetch(`${api}/order/${restaurantId}/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération de la commande");
            }
            return response.json();
        },
        onSuccess: (data) => {
            setOrderData(data.data);
            console.log(data.data[0].orderJoin);
            
            setOrderJoin(data.data[0].orderJoin);
        },
    });

    // Fetch tous les plats disponibles
    const { data: dishes, isLoading: isLoadingDishes, isError: isErrorDishes } = useQuery({
        queryKey: ["dishes"],
        queryFn: async () => {
            const response = await fetch(`${api}/dishes/allByRestaurant/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des plats");
            }
            return response.json();
        },
    });

    // Mutation pour mettre à jour la commande
    const updateOrderMutation = useMutation({
        mutationFn: async (updatedOrder: orderType) => {
            const response = await fetch(`${api}/order/${orderId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedOrder),
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la commande");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["order", orderId]);
            toast({
                title: "Succès",
                description: "Commande mise à jour avec succès !",
                variant: "success",
                duration: 3000,
            });
            onClose();
        },
        onError: (error) => {
            console.error("Erreur lors de la mise à jour :", error);
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour la commande.",
                variant: "destructive",
                duration: 3000,
            });
        },
    });

    // Gestion des champs modifiables
    const handleFieldChange = (field: keyof orderType, value: any) => {
        if (orderData) {
            setOrderData({ ...orderData, [field]: value });
        }
    };

    // Ajouter un plat au tableau temporaire
    const handleAddDish = (dishId: number) => {
        const dish = dishes?.data.find((d: any) => d.id === dishId);
        if (dish) {
            setOrderJoin([
                ...orderJoin,
                {
                    orderJoinId: Math.random(), // ID temporaire
                    orderId,
                    menuId: 0,
                    dishId: dish.id,
                    nbElement: 1,
                    restaurantId: dish.restaurantId,
                    menu: null,
                    dish,
                    item: { id: dish.id, name: dish.name },
                },
            ]);
        }
    };

    // Supprimer un plat du tableau temporaire
    const handleRemoveDish = (orderJoinId: number) => {
        setOrderJoin(orderJoin.filter((join) => join.orderJoinId !== orderJoinId));
    };

    // Validation du formulaire
    const handleSubmit = () => {
        if (orderData) {
            const updatedOrder: orderType = {
                ...orderData,
                orderJoin,
            };
            updateOrderMutation.mutate(updatedOrder);
        }
    };

    useEffect(() => {
    console.log(orderJoin);
    
    
    }, [orderJoin])
    

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Modifier la commande #{orderId}</h2>

                {isLoading ? (
                    <p>Chargement de la commande...</p>
                ) : isError ? (
                    <p>Erreur lors du chargement de la commande.</p>
                ) : (
                    <>
                        {/* Champs modifiables */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                État de la commande :
                            </label>
                            <input
                                type="text"
                                value={orderData?.state || ""}
                                onChange={(e) => handleFieldChange("state", e.target.value)}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Total :
                            </label>
                            <input
                                type="number"
                                value={orderData?.total || ""}
                                onChange={(e) => handleFieldChange("total", parseFloat(e.target.value))}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>

                        {/* Liste des plats */}
                        <div className="mb-4">
                            <h3 className="font-bold text-sm mb-2">Plats dans la commande :</h3>
                            <ul>
                                {orderJoin?.length > 0 ? (
                                    orderJoin.map((join) => (
                                        <li
                                            key={join.orderJoinId}
                                            className="flex justify-between items-center text-sm mb-2"
                                        >
                                            <span>
                                                {join.dish?.name || "Plat inconnu"} - {join.nbElement} x {join.dish?.price || 0} €
                                            </span>
                                            <button
                                                onClick={() => handleRemoveDish(join.orderJoinId)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-gray-500">Aucun plat dans la commande.</li>
                                )}
                            </ul>
                        </div>
                        {/* Ajouter un plat */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ajouter un plat :
                            </label>
                            <select
                                onChange={(e) => handleAddDish(Number(e.target.value))}
                                className="w-full border rounded p-2 text-sm"
                            >
                                <option value="">-- Choisir un plat --</option>
                                {dishes?.data?.map((dish: any) => (
                                    <option key={dish.id} value={dish.id}>
                                        {dish.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Valider
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};