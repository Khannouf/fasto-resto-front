import { motion } from "framer-motion";

const numberOrder = localStorage.getItem("OrderNumber")

const RecapAfterOrder = () => {
    // Exemple de données de commande
    const orderSummary = {
        total: 45.5,
        items: [
            { name: "Pizza Margherita", quantity: 2, price: 12.5 },
            { name: "Coca-Cola", quantity: 1, price: 3.0 },
        ],
    };

    return (
        <div className="min-h-screen bg-red-500 flex items-center justify-center">
            <motion.div
                initial={{ y: 1000, opacity: 0 }} // Position initiale (hors de l'écran en haut)
                animate={{ y: 0, opacity: 1 }} // Position finale (au centre)
                transition={{
                    type: "spring", // Utilisation d'un ressort pour l'effet de rebond
                    stiffness: 60, // Rigidité du ressort
                    damping: 12, // Amortissement pour contrôler le rebond
                }}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >
                <h1 className="text-2xl font-bold text-center mb-4">N° {numberOrder}</h1>
                <div className="space-y-4">
                    {orderSummary.items.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <span className="font-medium">{item.name}</span>
                            <span>
                                {item.quantity} x {item.price} €
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between items-center font-bold text-lg">
                    <span>Total :</span>
                    <span>{orderSummary.total} €</span>
                </div>
            </motion.div>
        </div>
    );
};

export default RecapAfterOrder;