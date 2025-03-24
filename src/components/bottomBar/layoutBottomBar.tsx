import React from "react";
import BottomBar from "./bottomBar";
import { Outlet, useLocation, useParams } from "react-router-dom";

const LayoutWithBottomBar: React.FC = () => {
    const location = useLocation()
    const { idResto } = useParams();
    console.log("ID du restaurant dans LayoutWithBottomBar :", location.pathname);
    
    return (
        <div className="min-h-screen flex flex-col">
            {/* Contenu principal */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Barre rouge fixée */}
            <BottomBar />
        </div>
    );
};

export default LayoutWithBottomBar;
