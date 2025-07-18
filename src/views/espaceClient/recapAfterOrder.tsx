import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { apiResponseOrderByIdType, orderJoinType, orderType } from "../../types/type";
import { useState } from "react";
import { Mosaic } from "react-loading-indicators";
import { useQuery } from "react-query";

const numberOrder = localStorage.getItem("OrderNumber");
const orderId = localStorage.getItem("OrderId");
const api = import.meta.env.VITE_API_URL;

const RecapAfterOrder = () => {
    const params = useParams();
    const [newData, setNewData] = useState<orderType | null>(null); // Utilisation de useState pour gérer newData

    const getOrder = async (idRestaurant: string, idOrder: string) => {
        const response = await fetch(`${api}/order/${idRestaurant}/order/${idOrder}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        const data: apiResponseOrderByIdType = await response.json();
        return data.data[0]; // Retourne uniquement la première commande
    };

    const { isLoading, isError, error } = useQuery({
        queryKey: ["order", params.idResto, orderId],
        queryFn: () => getOrder(params.idResto!, orderId!),
        onSuccess: (data) => {
            setNewData(data); // Met à jour newData avec les données récupérées
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <Mosaic color="#35ca35" size="medium" text="Chargement..." textColor="#000000" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <h1 className="text-white font-bold">Erreur : {(error as Error).message}</h1>
            </div>
        );
    }

    if (newData) {
        console.log(newData.state);
        
        return (
            <div className="min-h-screen bg-red-500 flex items-center justify-center">
                <motion.div
                    initial={{ y: 1000, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 12,
                    }}
                    className="bg-white p-8 rounded-lg shadow-lg w-96"
                >
                    <h1 className="text-2xl font-bold text-center mb-4">N° {numberOrder}</h1>
                    <div
                        className={`text-center text-sm font-semibold py-1 px-3 rounded-full mb-4 ${
                            newData.state === "a payer"
                                ? "bg-yellow-100 text-yellow-800"
                                : newData.state === "payé"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {newData.state.toUpperCase()}
                    </div>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                        {newData.orderJoin.map((joinItem: orderJoinType, index: number) => (
                            <div
                                key={index}
                                className="flex justify-between items-center border-b pb-2"
                            >
                                <span className="font-medium">{joinItem.dish.name}</span>
                                <span>
                                    {joinItem.nbElement} x {joinItem.dish.price} €
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center font-bold text-lg">
                        <span>Total :</span>
                        <span>{newData.total} €</span>
                    </div>
                    {newData.state === ""}
                </motion.div>
            </div>
        );
    }

    return null;
};

export default RecapAfterOrder;