import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { apiResponseOrderByIdType, orderJoinType, orderType } from "../../types/type";
import { useEffect, useState } from "react";
import { Mosaic, ThreeDot } from "react-loading-indicators";
import { useQuery } from "react-query";
import { io } from "socket.io-client";

const api = import.meta.env.VITE_API_URL;

const RecapAfterOrder = () => {
    const params = useParams();
    const [newData, setNewData] = useState<orderType | null>(null); // Utilisation de useState pour gérer newData

    // Récupérer les valeurs du localStorage à l'intérieur du composant
    const [numberOrder, setNumberOrder] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        // Récupérer les valeurs du localStorage quand le composant se monte
        const orderNumber = localStorage.getItem("OrderNumber");
        const orderIdFromStorage = localStorage.getItem("OrderId");
        setNumberOrder(orderNumber);
        setOrderId(orderIdFromStorage);
    }, []);

    const getOrder = async (idRestaurant: string, idOrder: string) => {
        const response = await fetch(`${api}/order/${idRestaurant}/order/${idOrder}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        const data: apiResponseOrderByIdType = await response.json();
        return data.data[0]; // Retourne uniquement la première commande
    };

    useEffect(() => {
        if (!params.idResto || !orderId) return; // Attendre que orderId soit disponible

        const socketInstance = io(`${api}/orders`, {
            transports: ["websocket"],
        })

        socketInstance.emit('joinRestaurant', {
            restaurantId: parseInt(params.idResto)
        });

        socketInstance.on('orderStateChanged', (orderData: { id: number; state: string }) => {
            console.log('Etat de commande changé : ', orderData);
            if (orderData.id === parseInt(orderId)) {
                setNewData(prevData => {
                    if (prevData) {
                        return {
                            ...prevData,
                            state: orderData.state,
                        };
                    }
                    return prevData;
                });
            }
        });

        // Gestion des erreurs de connexion
        socketInstance.on('connect_error', (error) => {
            console.error('Erreur de connexion Socket.IO:', error);
        });

        socketInstance.on('connect', () => {
            console.log('Connecté au serveur Socket.IO');
        });

        socketInstance.on('disconnect', () => {
            console.log('Déconnecté du serveur Socket.IO');
        });

        return () => {
            if (socketInstance) {
                socketInstance.emit('leaveRestaurant', {
                    restaurantId: parseInt(params.idResto!)
                });
                socketInstance.disconnect();
            }
        };
    }, [params.idResto, orderId]);

    const { isLoading, isError, error } = useQuery({
        queryKey: ["order", params.idResto, orderId],
        queryFn: () => getOrder(params.idResto!, orderId!),
        enabled: !!orderId && !!params.idResto, // Ne pas exécuter la query si orderId ou idResto n'est pas disponible
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
    const getStateColor = (state: string) => {
        switch (state) {
            case "a payer":
                return "bg-red-100 text-red-800";
            case "en préparation":
                return "bg-blue-100 text-blue-800";
            case "prête":
                return "bg-green-100 text-green-800";
            case "rendu":
                return "bg-purple-100 text-purple-800";
            case "fini":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (newData) {
        console.log('etat actuel de la commande : ' + newData.state);

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
                    <motion.div
                        key={newData.state} // Force la re-animation quand l'état change
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`text-center text-sm font-semibold py-2 px-4 rounded-full mb-4 ${getStateColor(newData.state)} flex items-center justify-center`}
                    >
                        {newData.state.toUpperCase()}
                        {newData.state === "en préparation" ? (
                            <div className="inline-block scale-50">
                                <ThreeDot color="#1E40AF" size="small" text="" textColor="" />
                            </div>
                        ) : newData.state === "prête" ? (
                            <div className="inline-block ml-2">
                                <img
                                    src="/system-regular-31-check-hover-check.gif" // Remplacez par l'URL correcte de votre GIF
                                    alt="Ready"
                                    className="w-7 h-7" // Ajuste la taille pour correspondre à ThreeDot
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </motion.div>
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
                </motion.div>
            </div >
        );
    }

    return null;
};

export default RecapAfterOrder;