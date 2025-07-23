import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "react-query";
import { useUserContext } from "../../context/userContext";
import { PieChartCard } from "../../components/PieChartDashboard";

const api = import.meta.env.VITE_API_URL;

function Dashboard() {
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const token = user?.token;
  const restaurantId = user?.restaurantId;

  const getOrderByDay = async (idRestaurant: number): Promise<any> => {
    const response = await fetch(`${api}/order/today/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des commandes du jour");
    }

    return response.json();
  };

  const { data: dataByDay, isLoading: isLoadingByDay, isError: isErrorByDay } = useQuery({
    queryKey: ["ordersDay", restaurantId],
    queryFn: () => getOrderByDay(restaurantId!),
    enabled: !!restaurantId,
  });

  const getOrderByMonth = async (idRestaurant: number): Promise<any> => {
    const response = await fetch(`${api}/order/month/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des commandes du mois");
    }

    return response.json();
  };

  const { data: dataByMonth, isLoading: isLoadingByMonth, isError: isErrorByMonth } = useQuery({
    queryKey: ["ordersMonth", restaurantId],
    queryFn: () => getOrderByMonth(restaurantId!),
    enabled: !!restaurantId,
  });

  const getOrderByPriceByMonth = async (idRestaurant: number): Promise<any> => {
    const response = await fetch(`${api}/order/price/month/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des prix des commandes du mois");
    }

    return response.json();
  };

  const { data: dataByPrice, isLoading: isLoadingByPrice, isError: isErrorByPrice } = useQuery({
    queryKey: ["ordersPriceMonth", restaurantId],
    queryFn: () => getOrderByPriceByMonth(restaurantId!),
    enabled: !!restaurantId,
  });

  return (
    <div className="h-screen flex flex-col">
      <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
        Dashboard
      </h1>
      <div className="ml-5 rounded-lg bg-gray-100 flex-1 p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Nombre de commandes par jour */}
        <div className="bg-white p-4 md:p-5 rounded-lg shadow-md flex flex-col justify-between">
          <p className="text-sm md:text-xl text-gray-600">Nombre de commande / jour</p>
          {dataByDay ? (
            <>
              <div className="bg-gray-50/80 p-4 rounded-lg shadow-lg backdrop-blur-md border border-gray-200 max-w-xs mx-auto">
                <p className="text-2xl md:text-3xl font-bold text-center">{dataByDay.data}</p>
              </div>
              <div className="flex items-center gap-2">
                {dataByDay.diff > 0 ? (
                  <>
                    <span className="bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300 text-xs md:text-sm">
                      +{dataByDay.diff}
                    </span>
                    <span className="text-xs font-bold md:text-sm">Comparé au jour précédent</span>
                  </>
                ) : (
                  <>
                    <span className="bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300 text-xs md:text-sm">
                      {dataByDay.diff}
                    </span>
                    <span className="text-xs font-bold md:text-sm">Comparé au jour précédent</span>
                  </>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Nombre de commandes par mois */}
        <div className="bg-white p-4 md:p-5 rounded-lg shadow-md flex flex-col justify-between">
          <p className="text-sm md:text-xl text-gray-600">Nombre de commande / mois</p>
          {dataByMonth ? (
            <>
              <div className="bg-gray-50/80 p-4 rounded-lg shadow-lg backdrop-blur-md border border-gray-200 max-w-xs mx-auto">
                <p className="text-2xl md:text-3xl font-bold text-center">{dataByMonth.data}</p>
              </div>
              <div className="flex items-center gap-2">
                {dataByMonth.diff > 0 ? (
                  <>
                    <span className="bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300 text-xs md:text-sm">
                      +{dataByMonth.diff}
                    </span>
                    <span className="text-xs font-bold md:text-sm">Comparé au mois précédent</span>
                  </>
                ) : (
                  <>
                    <span className="bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300 text-xs md:text-sm">
                      {dataByMonth.diff}
                    </span>
                    <span className="text-xs font-bold md:text-sm">Comparé au mois précédent</span>
                  </>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 md:p-5 rounded-lg shadow-md h-auto md:h-auto md:col-span-2 md:row-span-2">
          <PieChartCard />
        </div>

        {/* Revenus du mois */}
        <div className="bg-white p-4 md:p-5 rounded-lg shadow-md flex flex-col justify-between md:col-span-2">
          <p className="text-sm text-gray-600">Revenus du mois</p>
          {dataByPrice ? (
            <>
              <div className="bg-gray-100 p-5 rounded-md max-w-xs mx-auto">
                <p className="text-2xl md:text-3xl font-bold text-center">{dataByPrice.data.currentMonthTotal} €</p>
              </div>
              <div className="flex items-center gap-2">
                {dataByPrice.data.diff > 0 ? (
                  <>
                    <span className="bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300 text-xs md:text-sm">
                      +{dataByPrice.data.diff}
                    </span>
                    <span className="text-xs font-bold md:text-sm">Comparé au mois précédent</span>
                  </>
                ) : (
                  <>
                    <span className="bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300 text-xs md:text-sm">
                      {dataByPrice.data.diff} €
                    </span>
                    <span className="text-xs font-bold md:text-sm">Comparé au mois précédent</span>
                  </>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;