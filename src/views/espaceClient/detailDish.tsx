import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import pizzaImg from '../../assets/pizza.jpg';


const DetailDish = () => {
    const params = useParams()

    const item = {
        id: 1,
        imageUrl: {pizzaImg},
        name: "Pizza Margherita",
        description: "Pizza traditionnelle avec sauce tomate, mozzarella et basilic.",
        categorieid: 1,
        price: 9.99,
        ingredients: [
            { ingredientId: 1, quantity: '1' },
            { ingredientId: 2, quantity: '2' }
        ]
    }

    return (
        <>
            {/* La div verte avec z-0 pour qu'elle soit derrière */}
            <div className='fixed top-0 left-0 bg-green-200 w-full h-64 flex items-center justify-center z-0'>
                {/* <img src={item.imageUrl}
                        alt="Image"
                        className="w-full h-full object-cover" /> */}
            </div>


            {/* Le bouton retour avec un z-10 pour qu'il passe au-dessus */}
            <div className='bg-[#e3e2e2] h-10 w-10 fixed top-5 left-5 flex items-center justify-center rounded-full shadow-lg z-10'>
                <Link to={`/restaurant/${params.idResto}/menu`} className='text-black ml-[-1.25rem]'>
                    <ArrowLeft className='ml-5' />
                </Link>
            </div>
        </>
    )
}
export default DetailDish
