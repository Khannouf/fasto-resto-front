import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useCart } from "../../context/cartContext";
import { Dish } from "../../types/type";
import pizzaImg from "../../assets/pizza.jpg"; // Image par défaut

const DetailDish = () => {
    const { addDish, dishes } = useCart();
    const [comment, setComment] = useState("");
    const params = useParams();
    console.log(params);
    

    const item: Dish = {
        id: 10,
        name: "Pizza 4 formaggio",
        description: "Pizza traditionnelle avec sauce tomate, mozzarella et basilic.",
        price: 9.99,
        categorieId: 1,
        restaurantId: 1,
        dishIngredients: [
            {
                dishId: 1,
                ingredientId: 1,
                quantity: "1",
                ingredient: { id: 1, name: "Tomates" }
            },
            {
                dishId: 1,
                ingredientId: 2,
                quantity: "2",
                ingredient: { id: 2, name: "Mozzarella" }
            }
        ],
        imageDish: [
            {
                id: 1,
                filename: "pizza-margherita.jpg",
                dishId: 1
            }
        ],
        img: [
            {
                id: 1,
                imagePath: pizzaImg,
                dishId: 1
            }
        ],
    };

    const handleButton = () => {
        
        addDish(item);
        setComment('')

    };

    return (
        <div className="w-screen overflow-x-hidden">
            {/* Header avec image */}
            <div className="relative bg-green-200 w-full h-64 flex items-center justify-center">
                <img
                    src={item.img[0]?.imagePath || pizzaImg}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-5 left-5 bg-[#e3e2e2] h-10 w-10 flex items-center justify-center rounded-full shadow-lg z-10">
                    <Link to={`/restaurant/${params.idResto}/menu`} className="text-black">
                        <ArrowLeft />
                    </Link>
                </div>
            </div>

            {/* Contenu */}
            <div className="w-full flex flex-col gap-4 p-5 mt-5 rounded-t-3xl">
                {/* Nom et prix */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{item.name}</h1>
                    <span className="text-xl font-bold">{item.price} €</span>
                </div>

                {/* Description */}
                <p className="text-gray-700">{item.description}</p>

                {/* Ingrédients */}
                <div>
                    <h2 className="text-lg font-semibold mt-4 mb-2">Ingrédients :</h2>
                    <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
                        {item.dishIngredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.quantity} x {ingredient.ingredient.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Commentaire */}
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Ajouter un commentaire :</h2>
                    <textarea
                        id="comment"
                        name="comment"
                        className="w-full bg-gray-200 rounded-xl p-2"
                        placeholder="Ajouter des instructions ou préférences..."
                        onChange={(event) => setComment(event.target.value)}
                    />
                </div>

                {/* Bouton Ajouter au panier */}
                <Button className="w-full bg-green-500 text-white text-lg py-6 rounded-xl mt-4" onClick={handleButton}>
                    Ajouter au panier
                </Button>
            </div>

            <div className="w-full h-28 flex items-center justify-start bg-white"></div>
        </div>
    );
};

export default DetailDish;
