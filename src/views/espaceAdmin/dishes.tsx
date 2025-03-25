import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import { CardDishes } from '../../components/cardDishes';

export const Dishes = () => {
    const [showCard, setShowCard] = useState(false);
    return (
        <>

            <div className="h-screen flex flex-col ">
                <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
                    Plats
                </h1>
                <button
                    className="text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                    onClick={() => setShowCard(true)}
                >
                    <CirclePlus />
                    Nouveau plat
                </button>
            </div>

            {showCard && <CardDishes onClose={() => setShowCard(false)} />}
        </>
    )
}
