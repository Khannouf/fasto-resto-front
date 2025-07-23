// components/PieChartCard.tsx
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useQuery, useQueryClient } from "react-query";
import { useUserContext } from "../context/userContext";

const api = import.meta.env.VITE_API_URL;

export function PieChartCard() {
    const queryClient = useQueryClient();
    const { user } = useUserContext();
    const token = user?.token;
    const restaurantId = user?.restaurantId;

    const get4MostDishes = async () =>
        fetch(`${api}/order/piechart/data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des données du pie chart");
                }
                return res.json();
            })
            .then((response) => {
                // Reformater les données pour correspondre au format attendu
                return response.data.map((item: { name: string; count: number }) => ({
                    name: item.name,
                    value: item.count,
                }));
            });

    const { data, isLoading, isError } = useQuery({
        queryKey: ["top4", restaurantId],
        queryFn: () => get4MostDishes(),
        enabled: !!token && !!restaurantId,
    });

    if (isLoading) {
        return <p>Chargement des données...</p>;
    }

    if (isError) {
        return <p>Erreur lors du chargement des données.</p>;
    }

    return (
        <div className="p-5 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">Les best sellers</h2>
            <div className="w-full h-96">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={["#991B1B", "#DC2626", "#EF4444", "#FB5F5F", "#F87171"][index % 5]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}