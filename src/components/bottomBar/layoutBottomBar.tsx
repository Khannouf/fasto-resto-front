import React from "react";
import BottomBar from "./bottomBar";
import { useLocation, useParams } from "react-router-dom";

interface LayoutWithBottomBarProps {
    children: React.ReactNode;
}

const LayoutWithBottomBar: React.FC<LayoutWithBottomBarProps> = ({ children }) => {
    const location = useLocation()
    const {idResto} = useParams();
    console.log("ID du restaurant dans LayoutWithBottomBar :", location.pathname);
    
    return (
        <div className="min-h-screen flex flex-col">
            {/* Contenu principal */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Barre rouge fixée */}
            <BottomBar />
        </div>
    );
};

export default LayoutWithBottomBar;
