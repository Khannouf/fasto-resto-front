import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import pizzaImg from "../../assets/pizza.jpg";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
//import { Textarea } from '../../components/ui/textarea'
import {
  Dish,
  Ingredient,
  DishIngredient,
  ApiResponseDish,
} from "../../types/type";
import { useCart } from "../../context/cartContext";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "../../hooks/use-toast";

const api = import.meta.env.VITE_API_URL;

const SkeletonDetailDish = () => {
  return (
    <div className="w-screen overflow-x-hidden">
      {/* Skeleton pour l'image */}
      <div className="relative bg-gray-200 w-full h-64 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-5 left-5 bg-[#e3e2e2] h-10 w-10 flex items-center justify-center rounded-full shadow-lg z-10">
          <ArrowLeft />
        </div>
      </div>

      {/* Skeleton pour le contenu */}
      <div className="w-full flex flex-col gap-4 p-5 mt-5 rounded-t-3xl">
        {/* Skeleton pour le titre et le prix */}
        <div className="flex justify-between items-center">
          <Skeleton className="w-1/2 h-8 rounded-md" />
          <Skeleton className="w-16 h-8 rounded-md" />
        </div>

        {/* Skeleton pour la description */}
        <Skeleton className="w-full h-16 rounded-md" />

        {/* Skeleton pour la liste des ingrédients */}
        <div>
          <Skeleton className="w-32 h-6 mb-2" />
          <ul className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-3/4 h-5 rounded-md" />
            ))}
          </ul>
        </div>

        {/* Skeleton pour le champ commentaire */}
        <div className="mt-4">
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-full h-24 rounded-md" />
        </div>

        {/* Skeleton pour le bouton Ajouter au panier */}
        <Skeleton className="w-full h-12 rounded-xl mt-4" />
      </div>

      <div className="w-full h-28 flex items-center justify-start bg-white"></div>
    </div>
  );
};

const DetailDish = () => {
  const params = useParams();
  const { addDish, dishes } = useCart();
  const [dish, setDish] = useState<Dish | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {toast} = useToast()

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`${api}/dishes/${params.idElement}`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données");
        const data: ApiResponseDish = await response.json();
        setDish(data.data);
        console.log(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [params.idElement]);
  

  const handleButton = async () => {
    if (dish) {
      try {
        await addDish(dish);
        toast({
          title: "Succès",
          description: "Plat ajouté au panier avec succès !",
          variant: "success", // Type "success"
          duration: 1000, // Durée en ms
          className: "bg-green-700 text-white p-4 rounded-lg shadow-lg font-semibold", // Classes Tailwind
        });
      } catch (error) {
        // Affiche un toast d'erreur si addDish échoue
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'ajout du plat.",
          variant: "destructive", // Type "error"
          duration: 1000, // Durée en ms
          className: "bg-red-700 text-white p-4 rounded-lg shadow-lg font-semibold ", // Classes Tailwind
        });
        console.error("Erreur lors de l'ajout du plat :", error);
      }
    }

  };

  return (
    <>
      {loading ? (
        <SkeletonDetailDish />
      ) : (
        <div className="w-screen overflow-x-hidden">
          {/* Header avec image */}
          <div className="relative bg-green-200 w-full h-64 flex items-center justify-center">
            <img
              src={dish?.img?.[0].imagePath}
              alt="Image"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-5 left-5 bg-[#e3e2e2] h-10 w-10 flex items-center justify-center rounded-full shadow-lg z-10">
              <Link
                to={`/restaurant/${params.idResto}/${params.idTable}/menu`}
                className="text-black"
              >
                <ArrowLeft />
              </Link>
            </div>
          </div>

          {/* Contenu */}
          <div className="w-full flex flex-col gap-4 p-5 mt-5 rounded-t-3xl"> 
            {/* Nom et prix */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{dish?.name}</h1>
              <span className="text-xl font-bold">{dish?.price} €</span>
            </div>

            {/* Description */}
            <p className="text-gray-700">{dish?.description}</p>

            {/* Ingrédients */}
            <div>
              <h2 className="text-lg font-semibold mt-4 mb-2">Ingrédients :</h2>
              <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
                {dish?.dishIngredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.quantity} x{" "}
                    {ingredient.ingredient?.name ?? "Ingrédient inconnu"}
                  </li>
                ))}
              </ul>
            </div>

            {/* Commentaire */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">
                Ajouter un commentaire :
              </h2>
              {/* Rajouter le Textare de shadcn a la maison */}
              {/* <textarea id="story" name="story" className='w-full bg-gray-200 rounded-xl'></textarea> */}
              <Textarea
                placeholder="Ajouter des instructions ou préférences..."
                className="w-full"
              />
            </div>
            {/* Bouton Ajouter au panier */}
            <Button className="w-full bg-green-500 text-white text-lg py-6 rounded-xl mt-4" onClick={handleButton}>
              Ajouter au panier
            </Button>
          </div>

          <div className="w-full h-28 flex items-center justify-start bg-white"></div>
        </div>
      )}
    </>
  );
};
export default DetailDish;
