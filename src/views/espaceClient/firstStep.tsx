import { useEffect, useState } from "react";
import { MapPin, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import { Restaurant, ApiResponseRestaurant } from "../../types/type";

const api = import.meta.env.VITE_API_URL;

const SkeletonLoader = () => {
  return (
    <>
      {/* Barre supérieure */}
      <div className="bg-[#D9D9D9] w-full h-24 fixed top-0 flex items-center justify-center">
        <Skeleton className="rounded-full w-28 h-28 mt-24" />
      </div>

      {/* Nom du restaurant */}
      <Skeleton className="w-40 h-6 fixed top-[20%] left-1/2 transform -translate-x-1/2" />

      {/* Description avec ScrollArea */}
      <div className="bg-[#e7e7e7] w-80 h-64 fixed top-[25%] left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex">
        <ScrollArea className="h-full w-full">
          <div className="h-full overflow-y-auto">
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-3/4 h-6 mt-2" />
            <Skeleton className="w-full h-8 mt-2" />
          </div>
        </ScrollArea>
      </div>

      {/* Bouton "Sur place" */}
      <Skeleton className="w-80 h-24 fixed top-[57%] left-1/2 transform -translate-x-1/2" />

      {/* Bouton "À emporter" */}
      <Skeleton className="w-80 h-24 fixed top-[70%] left-1/2 transform -translate-x-1/2" />
    </>
  );
};

function FirstStep() {
  const location = useLocation();
  const idRestoUrl = location.pathname.split("/");
  const idResto = idRestoUrl[2];
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `${api}/restaurant/${idResto}`
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
    fetchRestaurant();
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          {error ? (
            <div> {error}</div>
          ) : (
            <>
              <div className="bg-[#D9D9D9] w-full h-24 fixed top-0 flex items-center justify-center">
                {/* <div className='bg-url[] rounded-full w-28 h-28 mt-24'></div> */}
                <div
                  className="rounded-full w-28 h-28 mt-24 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${restaurant?.img[0]?.imagePath})`,
                  }}
                ></div>
              </div>
              <p className="text-xl font-bold fixed top-[20%] left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                {restaurant?.restaurantName}
              </p>

              <div className="bg-[#e7e7e7] w-80 h-64 fixed top-[25%] left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex">
                <ScrollArea className="h-full w-full">
                  <div className="h-full overflow-y-auto">
                    <p className="text-lg text-center font-semibold">
                      {restaurant?.description}
                    </p>
                  </div>
                </ScrollArea>
              </div>

              <Link
                to={location.pathname + "/menu"}
                className="text-black"
                onClick={() => localStorage.setItem("locationEat", "on site")}
              >
                <button className="bg-[#FAFAFA] w-80 h-24 fixed top-[57%] left-1/2 transform -translate-x-1/2 flex items-center justify-between px-6 shadow-md rounded-lg">
                  <MapPin size={50} className="text-red-500" />
                  <span className="text-2xl font-bold mx-auto absolute left-1/2 transform -translate-x-1/2">
                    Sur place
                  </span>
                </button>
              </Link>
              <Link
                to={location.pathname + "/menu"}
                className="text-black"
                onClick={() => localStorage.setItem("locationEat", "take away")}
              >
                <button className="bg-[#FAFAFA] w-80 h-24 fixed top-[70%] left-1/2 transform -translate-x-1/2 flex items-center justify-between px-6 shadow-md rounded-lg">
                  <Package size={50} className="text-red-500" />
                  <span className="text-2xl font-bold mx-auto absolute left-1/2 transform -translate-x-1/2">
                    A emporter
                  </span>
                </button>
              </Link>
            </>
          )}
        </>
      )}
    </>
  );
}

export default FirstStep;
