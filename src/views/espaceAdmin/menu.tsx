import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { CardCategory } from "../../components/cardCategory";
import { DataTable } from "../../components/ui/data-table";
import { columns } from "../../components/table/tableCategory/columns";
import { Mosaic } from "react-loading-indicators";
import { useUserContext } from "../../context/userContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "../../hooks/use-toast"; // Import du hook
import { CardMenu } from "../../components/cardMenu";


const api = import.meta.env.VITE_API_URL;

export const Menus = () => {
    const queryClient = useQueryClient();
    const { user } = useUserContext()
    const token = user?.token
    const restaurantId = user?.restaurantId
    const [showCard, setShowCard] = useState(false);
    const [pageSize, setPageSize] = useState(10);

    const { toast } = useToast(); // Hook pour afficher le toast

    const handleSuccessToast = () => {
        toast({
            title: "Success",
            description: "Menu ajoutée avec succès",
            variant: "success", // Peut aussi être 'error', 'info', etc.
            duration: 3000, // Durée du toast en ms
        });

    };

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${api}/categorie/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Échec de la suppression");
            }

            return await response.json();
        },

        onSuccess: () => {
            toast({
                title: "Succès",
                description: "Catégorie supprimé avec succès !",
                variant: "success", // Type "success"
                duration: 1000, // Durée en ms
                className: "bg-green-700 text-white p-4 rounded-lg shadow-lg font-semibold", // Classes Tailwind
            });
            queryClient.invalidateQueries(["categories"]); // Force le refetch
        },

        onError: (error) => {
            console.error("Erreur lors de la suppression :", error);
            alert("Impossible de supprimer la catégorie.");
        },
    });


    const deleteCategory = (id: number) => {
        deleteCategoryMutation.mutate(id)

    };

    const getCategories = async (idRestaurant: number) => (
        fetch(`${api}/categorie/restaurant/${idRestaurant}`)
            .then((res) => res.json())
        //.then(apiResponseIngredientSchema.parse)
    )
    let { data, isLoading, isError } = useQuery({
        queryKey: ['categories', restaurantId],
        queryFn: () => getCategories(restaurantId!),
        enabled: !!restaurantId,
    })

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <Mosaic
                    color="#35ca35"
                    size="medium"
                    text="chargement..."
                    textColor="#000000"
                />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <p className="text-xl text-red-500">Erreur lors du chargement des menus.</p>
            </div>
        )
    }

    if (data) {


        // if (!data || data.length === 0) {
        //   data = []
        // }

        return (

            <>
                <div className="h-screen flex flex-col w-[80vw]">
                    <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
                        Menu
                    </h1>
                    <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center px-5 gap-2 mb-3">
                        <button
                            className="text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                            onClick={() => setShowCard(true)}
                        >
                            <CirclePlus />
                            Nouveau menu
                        </button>

                    </div>
                </div>

                {showCard && <CardMenu onClose={() => { setShowCard(false);/* handleSuccessToast();*/ }} />}
            </>
        )

    }
};
