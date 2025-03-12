import { Check, ShoppingCart, Trash } from "lucide-react";
import React, { useState } from "react";
import { useCart } from "../../context/cartContext";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Link, useLocation, useParams } from "react-router-dom";

const BottomBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { dishes, menus, removeDish, total } = useCart();
  const location = useLocation();
  const idRestoUrl = location.pathname.split('/')    
  const idResto = idRestoUrl[2];
  
  

  const handleButton = () => {
    setIsExpanded(!isExpanded);
    console.log("dishes: " + dishes);
  };

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
          className={`bg-[#FFD5D5] ${isExpanded ? "mb-[80vh]" : "mb-14"} transition-all duration-500 ease-in-out`}
          onClick={handleButton}
        >
          <ShoppingCart size={50} />
        </button>
      </div>

      {/* La div blanche avec animation pour son affichage */}
      {isExpanded && (
        <div className="absolute bg-white w-[90vw] h-[65vh] flex flex-col justify-center items-center top-1/2 transform -translate-y-1/2 opacity-1 transition-opacity duration-500 ease-in-out animate-fade-in pl-4 pr-4">
          {dishes.length > 0 || menus.length > 0 ? (
            <>
              {/* Affichage des `id` des plats */}
              <ScrollArea className="w-full h-[50vh] overflow-auto p-2">

                <div className="w-full text-center">
                  {dishes.map((dishContext, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b border-gray-300">
                      {/* Image */}
                      <img
                        src={dishContext.dish.img[0]?.imagePath}  // Utilise l'URL de l'image du plat
                        alt={dishContext.dish.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      {/* Titre et prix */}
                      <div className="flex flex-col ml-4">
                        <span className="text-lg font-semibold">{dishContext.dish.name}</span>
                        <span className="text-md text-gray-500"> {dishContext.quantity} x {dishContext.dish.price} €</span>
                      </div>

                      {/* Plat ID */}
                      <button className="text-sm text-red-500 bg-inherit" onClick={() => (removeDish(index))}><Trash /></button>
                    </div>
                  ))}
                </div>

              </ScrollArea>
              <Separator />
              <div className="w-full justify-end items-end text-end">
                <div className="h-10 text-2xl font-bold mt-4 mr-4">{total} €</div>
                <Link to={`/order/${idResto}/recapBeforeOrder`} onClick={() => (setIsExpanded(!isExpanded))}>
                  <button className="w-full text-white font-semibold flex items-center justify-center gap-x-2">
                    <Check /> Commander
                  </button>

                </Link>

              </div>
            </>
          ) : (
            <p>Panier vide</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BottomBar;
