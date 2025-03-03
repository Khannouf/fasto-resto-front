import { useState } from 'react'
import { MapPin, ShoppingCart } from 'lucide-react'

function FirstStep() {

    return (
        <>
            <div className='bg-[#D9D9D9] w-full h-36 fixed top-0 flex items-center justify-center'>
                <div className='bg-[#FFD5D5] rounded-full w-36 h-36 mt-36'></div>
            </div>

            <div className='bg-[#D9D9D9] w-80 h-64 fixed top-[30%] left-1/2 transform -translate-x-1/2 flex items-center justify-center p-4 rounded-lg'>
                <p className='text-sm text-center'>Description</p>
            </div>

            <button
                className='bg-[#FAFAFA] w-80 h-24 fixed top-[63%] left-1/2 transform -translate-x-1/2 flex items-center justify-between px-6 shadow-md rounded-lg'
            >
                <MapPin size={50} className='text-red-500'/>
                <span className='text-2xl font-bold mx-auto absolute left-1/2 transform -translate-x-1/2'>Sur place</span>
            </button>
        </>
    )
}

export default FirstStep
