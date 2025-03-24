import React, { useEffect, useState } from "react";
import { ApiResponseSchedules, ScheduleDayRow } from "../../types/type";
import { DataTable } from "../../components/ui/data-table";
import { columns } from "../../components/table/tableSchedules/columns";
import { Mosaic } from "react-loading-indicators";

const api = import.meta.env.VITE_API_URL;

export const Schedules = () => {
  const [pageSize, setPageSize] = useState(10);
  const [scheduleRows, setScheduleRows] = useState<ScheduleDayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`${api}/schedules/1`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des données");

        const data: ApiResponseSchedules = await response.json();

        // Transformer l'objet reçu en tableau
        const rows: ScheduleDayRow[] = Object.entries(data.data).map(
          ([day, value]) => ({
            day,
            start: (value as any).start,
            end: (value as any).end,
          })
        );

        setScheduleRows(rows);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <Mosaic color="#35ca35" size="medium" text="chargement..." textColor="#000000" />
        </div>
      ) : (
        <div className="h-screen flex flex-col w-[80vw]">
          <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
            Horaires
          </h1>
          <div className="ml-5 rounded-lg bg-[#ffffff] flex-1 p-5 lg:w-[90vw] md:w-[50vw]">
            <DataTable columns={columns} data={scheduleRows} pageSize={pageSize} />
          </div>
        </div>
      )}
    </>
  );
};
