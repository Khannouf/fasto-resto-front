import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

export const RecapBeforeOrder = () => {
    const params = useParams()
    console.log(params);
    

    return (
        <>
            <div className="absolute top-5 left-5 bg-[#e3e2e2] h-10 w-10 flex items-center justify-center rounded-full shadow-lg z-10">
                <Link to={`/restaurant/${params.idResto}/menu`} className="text-black">
                    <ArrowLeft />
                </Link>
            </div>
            <div>recapBeforeOrder</div>
        </>
    )
}
