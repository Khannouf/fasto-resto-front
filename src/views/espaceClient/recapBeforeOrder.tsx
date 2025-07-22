import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../context/cartContext';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import RecapCardItem from '../../components/recapCardItem';
import {  ApiResponseOrder, orderBodyType } from '../../types/type';
import { useMutation, useQueryClient } from 'react-query';

const api = import.meta.env.VITE_API_URL;

export const RecapBeforeOrder = () => {
    const queryClient = useQueryClient();
    const { dishes, menus, total, addComment, verifPrice } = useCart();
    const params = useParams();
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const commentRef = useRef<HTMLTextAreaElement>(null);

    const mutation = useMutation({
        mutationFn: (order: orderBodyType) =>
            fetch(`${api}/order/${params.idResto}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order)
            }).then((res) => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries(["order"]);
        },

    })

    const handleButton = () => {

        verifPrice()
        const orderFetchBody: orderBodyType = {
            total: total, // Total provenant de votre calcul ou contexte
            state: "a payer", // État de la commande
            tableId: Number(params.idTable), // Conversion de tableId en nombre
            orderJoin: {
                menu: menus.map((menu) => ({
                    id: menu.id,
                    name: menu.name,
                    price: menu.price,
                    nbelement: menu.nbelement,
                    dish: menu.dish.map((dish) => ({
                        dishId: dish.dishId,
                        configuration: dish.configuration,
                    })),
                })), // Transformation des menus en structure conforme à `orderBodyType`
                dish: dishes.map((dishContext) => ({
                    id: dishContext.dish.id,
                    nbelement: dishContext.nbElement,
                })), // Transformation des plats en structure conforme à `orderBodyType`
            },
        };
        console.log(orderFetchBody);
        mutation.mutate(orderFetchBody, {
            onSuccess: (data: ApiResponseOrder) => {

                console.log("resultats reussis : " + data);
                localStorage.setItem("OrderNumber", data.data.sequentialId.toString())
                localStorage.setItem("OrderId", data.data.id.toString())

                queryClient.invalidateQueries(["order"]); // refetch
                navigate(`/order/${params.idResto}/${params.idTable}/recapAfterOrder`);
            },
            onError: (error) => {
                console.error("Erreur lors de l'ajout :", error);
                alert("Une erreur est survenue lors de la création de la commande.");
            }
        })

        const commentValue = commentRef.current?.value; // Récupère la valeur au moment du clic
        if (commentValue) {
            addComment(commentValue);
        } else {
            console.log('le commentaire n\'est pas passé');
        }
    };

    useEffect(() => {
        verifPrice()
    }, [dishes, total])



    return (
        <>
            {/* Back Button */}
            <div className="absolute top-4 left-4 bg-gray-200 h-10 w-10 flex items-center justify-center rounded-full shadow-md z-10">
                <Link to={`/restaurant/${params.idResto}/${params.idTable}/menu`} className="text-black">
                    <ArrowLeft />
                </Link>
            </div>

            {/* Main Content */}
            <div className="absolute inset-0 flex flex-col justify-between items-center px-4">
                {/* Title */}
                <div className="text-center text-xl font-bold mt-6 mb-4">Ma commande</div>

                {/* Scrollable Area */}
                <div className="w-full h-[55vh] flex items-start justify-start overflow-hidden rounded-lg shadow-md bg-white">
                    <ScrollArea className="w-full h-full">
                        <div className="flex flex-col gap-4 p-4">
                            {dishes.map((dishContext, index) => (
                                <RecapCardItem
                                    key={index}
                                    idResto={params.idResto!}
                                    idElement={dishContext.dish.id}
                                    imageUrl={dishContext.dish.img?.[0].imagePath}
                                    name={dishContext.dish.name}
                                    quantity={dishContext.quantity}
                                    price={dishContext.dish.price}
                                    categorieId={dishContext.dish.categorieId}
                                    ingredients={dishContext.dish.dishIngredients}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Comment Section */}
                <div className="w-full bg-white p-4 rounded-lg shadow-md mt-4">
                    <h2 className="text-lg font-semibold mb-2">Ajouter un commentaire :</h2>
                    <textarea
                        id="comment"
                        name="comment"
                        className="w-full bg-gray-100 rounded-lg p-3 text-sm"
                        placeholder="Ajouter des instructions ou préférences..."
                        ref={commentRef}
                    />
                </div>

                {/* Separator */}
                <Separator className="w-full bg-gray-300 h-[1px] my-4" />

                {/* Footer Section */}
                {loading ? (
                    <></>
                ) : (
                    <div className="w-full bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <p className="text-2xl font-bold">{total} €</p>
                            <button
                                className="bg-red-500 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-md hover:bg-red-600"
                                onClick={() => handleButton()}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};