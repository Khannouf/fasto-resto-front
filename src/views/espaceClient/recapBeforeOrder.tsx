import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../../context/cartContext'
import CardItem from '../../components/cardItem'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Separator } from "../../components/ui/separator";

export const RecapBeforeOrder = () => {
    const { dishes, menus, total } = useCart()
    console.log(dishes);

    const params = useParams()
    console.log(params);


    return (
        <>
            <div className="absolute top-5 left-5 bg-[#e3e2e2] h-10 w-10 flex items-center justify-center rounded-full shadow-lg z-10">
                <Link to={`/restaurant/${params.idResto}/menu`} className="text-black">
                    <ArrowLeft />
                </Link>
            </div>
            <div className="absolute inset-0 m-4 flex flex-col justify-center items-center">
                <div className="absolute top-4 text-center text-xl font-bold">Ma commande :</div>
                <div className='w-full h-[70vh] fixed top-16 flex items-center justify-start'>
                    <ScrollArea className="w-full h-full">
                        <div className="flex flex-col gap-4 p-4">
                            {dishes.map((dish, index) => (
                                <CardItem
                                    key={index}
                                    idResto={params.idResto!}
                                    idElement={dish.id}
                                    imageUrl={dish.img?.[0].imagePath}
                                    name={dish.name}
                                    description={dish.description}
                                    price={dish.price}
                                    categorieId={dish.categorieid}
                                    ingredients={dish.dishIngredients}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className='fixed top-[82vh] w-full flex'>
                    <Separator className=' fixed w-full bg-black h-2 ' />
                    <div className='mt-5 mx-5 flex'>
                        <p className=' text-3xl font-bold text-start ml-10 mt-5'> {total} €</p>
                        <button className='bg-red-400 rounded-full items-end mt-4 text-xl font-semibold'> Valider </button>
                    </div>
                </div>
            </div>



        </>
    )
}
