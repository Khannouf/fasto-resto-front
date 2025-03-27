import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { CardCategory } from "../../components/cardCategory";
import { DataTable } from "../../components/ui/data-table";
import { columns } from "../../components/table/tableCategory/columns";
import { Mosaic } from "react-loading-indicators";
import { useUserContext } from "../../context/userContext";
import { useMutation, useQuery, useQueryClient } from "react-query";

const api = import.meta.env.VITE_API_URL;

export const Category = () => {
  const queryClient = useQueryClient();
  const { user } = useUserContext()
  const token = user?.token
  const restaurantId = user?.restaurantId
  const [showCard, setShowCard] = useState(false);
  const [pageSize, setPageSize] = useState(10);

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
    queryKey: ['categories'],
    queryFn: () => getCategories(restaurantId!),
    enabled: !!restaurantId,
  })

  if(isLoading){
    return(
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

  if(isError){
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <p className="text-xl text-red-500">Erreur lors du chargement des horaires.</p>
      </div>
    )
  }

  if(data){
    
    
    // if (!data || data.length === 0) {
    //   data = []
    // }
    
    return(

    <>
          <div className="h-screen flex flex-col w-[80vw]">
            <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
              Catégorie
            </h1>
            <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center px-5 gap-2 mb-3">
              <button
                className="text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                onClick={() => setShowCard(true)}
              >
                <CirclePlus />
                Nouvelle catégorie
              </button>
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">
                  Afficher
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border rounded p-1 text-sm bg-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700 ml-2">éléments</span>
              </div>
            </div>

            {/* Table */}
            <div className="ml-5 rounded-lg bg-[#ffffff] flex-1 p-5 lg:w-[90vw] md:w-[50vw]">
              <DataTable
                columns={columns(deleteCategory)}
                data={data.data}
                pageSize={pageSize}
              />
            </div>
          </div>

          {showCard && <CardCategory onClose={() => {setShowCard(false)}} />}
        </>
    )

  }
  // return (
  //   <>
  //     {loading ? (
  //       <div className="flex justify-center items-center h-screen w-screen">
  //         <Mosaic
  //           color="#35ca35"
  //           size="medium"
  //           text="chargement..."
  //           textColor="#000000"
  //         />
  //       </div>
  //     ) : (
  //       <>
  //         <div className="h-screen flex flex-col w-[80vw]">
  //           <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
  //             Catégorie
  //           </h1>
  //           <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center px-5 gap-2 mb-3">
  //             <button
  //               className="text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
  //               onClick={() => setShowCard(true)}
  //             >
  //               <CirclePlus />
  //               Nouvelle catégorie
  //             </button>
  //             <div className="flex items-center">
  //               <label className="text-sm font-medium text-gray-700 mr-2">
  //                 Afficher
  //               </label>
  //               <select
  //                 value={pageSize}
  //                 onChange={(e) => setPageSize(Number(e.target.value))}
  //                 className="border rounded p-1 text-sm bg-white"
  //               >
  //                 <option value={10}>10</option>
  //                 <option value={25}>25</option>
  //                 <option value={50}>50</option>
  //                 <option value={100}>100</option>
  //               </select>
  //               <span className="text-sm text-gray-700 ml-2">éléments</span>
  //             </div>
  //           </div>

  //           {/* Table */}
  //           <div className="ml-5 rounded-lg bg-[#ffffff] flex-1 p-5 lg:w-[90vw] md:w-[50vw]">
  //             <DataTable
  //               columns={columns(deleteCategory)}
  //               data={categories!}
  //               pageSize={pageSize}
  //             />
  //           </div>
  //         </div>

  //         {showCard && <CardCategory onClose={() => {setShowCard(false)}} />}
  //       </>
  //     )}
  //   </>
  // );
};
