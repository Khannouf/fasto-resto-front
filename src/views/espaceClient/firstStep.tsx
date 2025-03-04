import { useState } from 'react'
import { MapPin, Package, ShoppingCart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

function FirstStep() {
    const location = useLocation();
    const idRestoUrl = location.pathname.split('/')    
    const idResto = idRestoUrl[2];
    
    



    return (
        <>
            <div className='bg-[#D9D9D9] w-full h-24 fixed top-0 flex items-center justify-center'>
                <div className='bg-[#FFD5D5] rounded-full w-28 h-28 mt-24'></div>
            </div>
            <p className="text-xl font-bold fixed top-[20%] left-1/2 transform -translate-x-1/2 flex items-center justify-center">nom restaurant </p>

            <div className='bg-[#D9D9D9] w-80 h-64 fixed top-[25%] left-1/2 transform -translate-x-1/2 flex items-center justify-center p-4 rounded-lg'>
                <p className='text-sm text-center'>Description</p>
            </div>
            <Link to={location.pathname + "/menu"} className='text-black' onClick={() => (localStorage.setItem("locationEat", "on site"))}>

                <button
                    className='bg-[#FAFAFA] w-80 h-24 fixed top-[57%] left-1/2 transform -translate-x-1/2 flex items-center justify-between px-6 shadow-md rounded-lg'
                >
                    <MapPin size={50} className='text-red-500' />
                    <span className='text-2xl font-bold mx-auto absolute left-1/2 transform -translate-x-1/2'>Sur place</span>
                </button>
            </Link>
            <Link to={location.pathname + "/menu"} className='text-black' onClick={() => (localStorage.setItem("locationEat", "take away"))}>

                <button
                    className='bg-[#FAFAFA] w-80 h-24 fixed top-[70%] left-1/2 transform -translate-x-1/2 flex items-center justify-between px-6 shadow-md rounded-lg'
                >
                    <Package size={50} className='text-red-500' />
                    <span className='text-2xl font-bold mx-auto absolute left-1/2 transform -translate-x-1/2'>A emporter</span>
                </button>
            </Link>
        </>
    )
}

export default FirstStep
