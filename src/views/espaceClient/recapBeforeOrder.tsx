import { ArrowLeft } from 'lucide-react'
import { useRef  } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../../context/cartContext'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Separator } from "../../components/ui/separator";
import RecapCardItem from '../../components/recapCardItem'

export const RecapBeforeOrder = () => {
    const { dishes, menus, total, addComment } = useCart()
    const params = useParams()

    const commentRef = useRef<HTMLTextAreaElement>(null);

    const handleButton = () => {
        const commentValue = commentRef.current?.value; // Récupère la valeur au moment du clic
        if (commentValue){
            addComment(commentValue)
            
        } else( 
            console.log("le commentaire n'est pas passé")
            
        )
    };

    return (
        <>
            <div className="absolute top-5 left-5 bg-[#e3e2e2] h-10 w-10 flex items-center justify-center rounded-full shadow-lg z-10">
                <Link to={`/restaurant/${params.idResto}/menu`} className="text-black">
                    <ArrowLeft />
                </Link>
            </div>
            <div className="absolute inset-0 m-4 flex flex-col justify-center items-center">
                <div className="absolute top-4 text-center text-xl font-bold">Ma commande :</div>
                <div className='w-full h-[60vh] fixed top-16 flex items-center justify-start'>
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
                <div className="fixed bottom-0 w-full bg-white p-4 shadow-lg">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Ajouter un commentaire :</h2>
                        <textarea
                            id="comment"
                            name="comment"
                            className="w-full bg-gray-200 rounded-xl p-2"
                            placeholder="Ajouter des instructions ou préférences..."
                            ref={commentRef}
                        />
                    </div>

                    <Separator className="w-full bg-black h-2" />

                    <div className="mt-5 flex justify-between items-center">
                        <p className="text-3xl font-bold">{total} €</p>
                        <button className="bg-red-400 rounded-full px-6 py-2 text-xl font-semibold" onClick={() => (handleButton())}>
                            Valider
                        </button>
                    </div>
                </div>

            </div>



        </>
    )
}
