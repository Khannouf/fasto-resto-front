import React from "react";
import BottomBar from "./bottomBar";

interface LayoutWithBottomBarProps {
    children: React.ReactNode;
}

const LayoutWithBottomBar: React.FC<LayoutWithBottomBarProps> = ({ children }) => {
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
