import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import CardItem from "../../components/cardItem";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Categorie,
  ApiResponseCategorie,
  ApiResponseRestaurant,
  Restaurant,
  Dish,
  ApiResponseDish,
} from "../../types/type";

const api = import.meta.env.VITE_API_URL;

const SkeletonLoader = () => {
  return (
    <>
      {/* Barre supérieure */}
      <div className="bg-[#D9D9D9] w-full h-12 fixed top-0 flex items-center justify-start">
        <Link to="#" className="text-black">
          <ArrowLeft className="ml-5" />
        </Link>
        <Skeleton className="w-40 h-6 ml-5 mb-1 rounded-md" />
      </div>

      {/* Skeleton des catégories */}
      <div className="w-full h-16 fixed top-12 flex items-center justify-start bg-white">
        <ScrollArea className="w-full">
          <div className="flex w-max space-x-2 px-4 py-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-24 h-8 rounded-full" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Skeleton des éléments de menu */}
      <div className="w-full h-[75%] fixed top-28 flex items-center justify-start">
        <ScrollArea className="w-full h-full">
          <div className="flex flex-col gap-4 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex flex-col w-full">
                  <Skeleton className="w-3/4 h-6 mb-2" />
                  <Skeleton className="w-1/2 h-4" />
                  <Skeleton className="w-1/3 h-4 mt-2" />
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </>
  );
};

function RestaurantMenu() {
  const location = useLocation();
  const params = useParams();
  const [categories, setCategories] = useState<Categorie[] | null>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `${api}/restaurant/${params.idResto}`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données");
        const data: ApiResponseRestaurant = await response.json();
        setRestaurant(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${api}/categorie/restaurant/${params.idResto}`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données");
        const data: ApiResponseCategorie = await response.json();
        // Vérifier si l'API retourne un tableau ou un objet unique
        const categoriesArray = Array.isArray(data.data)
          ? data.data
          : [data.data];
        setCategories(categoriesArray);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    const fetchDishes = async () => {
      try {
        const response = await fetch(
          `${api}/dishes/allByRestaurant/${params.idResto}`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données");
        const data: ApiResponseDish = await response.json();
        setDishes(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
    fetchRestaurant();
    fetchDishes();
  }, [params.idResto]); // Ajout de `params.idResto` comme dépendance pour recharger si l'ID change

  useEffect(() => {
    if (categories && categories.length > 0) {
      setActiveCategory(categories[0].id); // Définit la première catégorie comme active
    }
  }, [categories]); // Dépend de `categories`

  const filteredItems = dishes?.filter(
    (dishe) => dishe.categorieId === activeCategory
  );

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="bg-[#D9D9D9] w-full h-12 fixed top-0 flex items-center justify-start">
            <Link to={`/restaurant/${params.idResto}/${params.idTable}`} className="text-black">
              <ArrowLeft className="ml-5" />
            </Link>
            <p className="text-xl font-bold ml-5 mb-1">
              {restaurant?.restaurantName}
            </p>
          </div>

          <div className="w-full h-16 fixed top-12 flex items-center justify-start bg-white">
            <ScrollArea className="w-full">
              <div className="flex w-max space-x-2 px-4 py-2">
                {categories?.map((categorie) => (
                  <button
                    key={categorie.id}
                    onClick={() => setActiveCategory(categorie.id)}
                    className={`text-sm font-medium px-4 py-2 transition-all rounded-full ${
                      activeCategory === categorie.id
                        ? "bg-red-700 text-white"
                        : "bg-[#FFD5D5] text-black"
                    }`}
                  >
                    {categorie.name}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
          <div className="w-full h-[75%] fixed top-28 flex items-center justify-start">
            <ScrollArea className="w-full h-full">
              <div className="flex flex-col gap-4 p-4">
                {filteredItems ? 
                <>
                {filteredItems.length > 0 ? (
                  filteredItems.map((dish) => (
                    <>
                    <CardItem
                      key={dish.id}
                      idResto={params.idResto!}
                      idTable={params.idTable}
                      idElement={dish.id}
                      imageUrl={dish.imageUrl}
                      name={dish.name}
                      description={dish.description}
                      price={dish.price}
                      categorieId={dish.categorieId}
                      ingredients={dish.dishIngredients}
                    />
                    </>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    Aucun élément dans cette catégorie.
                  </p>
                )}
                </> : 
                <>
                </>}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </>
      )}
    </>
  );
}

export default RestaurantMenu;
