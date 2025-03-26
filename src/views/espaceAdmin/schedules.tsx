import React, { useEffect, useState } from "react";
import { apiResponseIngredientSchema, ApiResponseSchedules, ingredientSchema, ScheduleDayRow, scheduleSchema } from "../../types/type";
import { DataTable } from "../../components/ui/data-table";
import { columns } from "../../components/table/tableSchedules/columns";
import { Mosaic } from "react-loading-indicators";
import { useUserContext } from "../../context/userContext";
import { useQuery } from "react-query";

const api = import.meta.env.VITE_API_URL;

export const Schedules = () => {
  const [pageSize, setPageSize] = useState(10);
  const { user } = useUserContext();
  const restaurantId = user?.restaurantId

  const getSchedules = async (idRestaurant: number) => (
    fetch(`${api}/schedules/${idRestaurant}`)
      .then((res) => res.json())
    //.then(apiResponseIngredientSchema.parse)
  )
  const { data, isLoading, isError } = useQuery({
    queryKey: ['schedules', restaurantId],
    queryFn: () => getSchedules(restaurantId!),
    enabled: !!restaurantId,
  })



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Mosaic color="#35ca35" size="medium" text="chargement..." textColor="#000000" />
      </div>
    );
  }

  // 🔴 Affichage d'un message d'erreur si la requête échoue
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <p className="text-xl text-red-500">Erreur lors du chargement des horaires.</p>
      </div>
    );
  }

  // 🔍 Vérifie que data.data existe avant de le transformer
  let scheduleRows =
    data?.data &&
    Object.entries(data.data).map(([day, { start, end }]) => ({
      day,
      start,
      end,
    }));

  // 🔘 Affichage des horaires si des données sont présentes
  if (!scheduleRows || scheduleRows.length === 0) {
    scheduleRows = []
  }

  return (
    <div className="h-screen flex flex-col w-[80vw]">
      <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
        Horaires
      </h1>
      <div className="ml-5 rounded-lg bg-[#ffffff] flex-1 p-5 lg:w-[90vw] md:w-[50vw]">
        <DataTable columns={columns} data={scheduleRows} pageSize={pageSize} />
      </div>
    </div>
  );
};
