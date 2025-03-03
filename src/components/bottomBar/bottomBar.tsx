import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";

const BottomBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`fixed bottom-0 left-0 
        ${isExpanded ? "h-[80vh]" : "h-14"}
        w-full bg-[#FFD5D5] flex items-center justify-center shadow-md transition-all duration-500 ease-in-out`}
    >
      <div  
        className={`bg-[#FFD5D5] 
          ${isExpanded ? "w-60 h-[95vh] rounded-full" : "w-36 h-40 rounded-full"} 
          flex items-center justify-center transition-all duration-500 ease-in-out`}
      >
        <button
          className={`bg-[#FFD5D5] ${isExpanded ? " mb-[80vh]" : " mb-14"}  transition-all duration-500 ease-in-out`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ShoppingCart size={50} />
        </button>
      </div>

      {/* La div blanche avec animation pour son affichage */}
      {isExpanded && (
        <div className="absolute bg-white w-[70vw] h-[65vh] flex justify-center items-center top-1/2 transform -translate-y-1/2 opacity-1 transition-opacity duration-500 ease-in-out animate-fade-in">
          <p>Contenu supplémentaire ici</p>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
