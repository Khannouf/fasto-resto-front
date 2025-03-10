import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { CartContextType, Dish, Menu, CartState } from "../types/type";

// Définition des actions possibles
type CartAction =
    | { type: "ADD_DISH"; payload: Dish }
    | { type: "REMOVE_DISH"; payload: number }
    | { type: "ADD_MENU"; payload: Menu }
    | { type: "REMOVE_MENU"; payload: number };


    

// Reducer pour gérer l'état du panier
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_DISH":
            const newTotalAddDish = parseFloat((state.total + action.payload.price).toFixed(2));
            return {
                ...state,
                dishes: [...state.dishes, action.payload],
                total: newTotalAddDish,
            };
        case "REMOVE_DISH":
            const removedDish = state.dishes[action.payload];
            const newTotalRemoveDish = parseFloat((state.total - (removedDish?.price || 0)).toFixed(2));
            const newDishes = [...state.dishes];
            newDishes.splice(action.payload, 1);
            if (state.dishes.length === 1) {
                // Si c'est le dernier plat, on vide le tableau directement
                return {
                    ...state,
                    dishes: [],
                    total: newTotalRemoveDish,
                };
            } else {

                return {
                    ...state,
                    dishes: newDishes,
                    total: newTotalRemoveDish,
            }
            };
        case "ADD_MENU":
            const newTotalAddMenu = parseFloat((state.total + action.payload.price).toFixed(2));
            return {
                ...state,
                menus: [...state.menus, action.payload],
                total: newTotalAddMenu,
            };
        case "REMOVE_MENU":
            const removedMenu = state.menus.find(menu => menu.id === action.payload);
            const newTotalRemoveMenu = parseFloat((state.total - (removedMenu?.price || 0)).toFixed(2));
            return {
                ...state,
                menus: state.menus.filter(menu => menu.id !== action.payload),
                total: newTotalRemoveMenu,
            };
        default:
            return state;
    }
};



// Création du contexte
export const CartContext = createContext<CartContextType | null>(null);

// Provider du contexte
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const initialState: CartState = {
        menus: [],
        dishes: [],
        total: 0,
    };

    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Définition des fonctions du contexte
    const addDish = (dish: Dish) => dispatch({ type: "ADD_DISH", payload: dish });
    const removeDish = (index: number) => dispatch({ type: "REMOVE_DISH", payload: index });
    const addMenu = (menu: Menu) => dispatch({ type: "ADD_MENU", payload: menu });
    const removeMenu = (menuId: number) => dispatch({ type: "REMOVE_MENU", payload: menuId });

    return (
        <CartContext.Provider value={{ ...state, addDish, removeDish, addMenu, removeMenu }}>
            {children}
        </CartContext.Provider>
    );
};




// Hook personnalisé pour utiliser le contexte
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
