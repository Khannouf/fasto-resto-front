import React, { createContext, useContext, useReducer } from "react";

// Importer les types définis ci-dessus
import { Cart, CartAction, Dish, Menu } from '../types/type';

// Valeur initiale du panier
const initialCart: Cart = {
    dishes: [],
    menus: []
};

// Réducteur qui gère les actions
const cartReducer = (state: Cart, action: CartAction): Cart => {
    switch (action.type) {
        case "ADD_DISH":
            return { ...state, dishes: [...state.dishes, action.dish] };
        case "REMOVE_DISH":
            return { ...state, dishes: state.dishes.filter(dish => dish.id !== action.dishId) };
        case "ADD_MENU":
            return { ...state, menus: [...state.menus, action.menu] };
        case "REMOVE_MENU":
            return { ...state, menus: state.menus.filter(menu => menu.id !== action.menuId) };
        default:
            return state;
    }
};

// Créer un CartContext
const CartContext = createContext<{
    cart: Cart;
    dispatch: React.Dispatch<CartAction>;
}>({
    cart: initialCart,
    dispatch: () => null
});

// Fournisseur CartContext
export const CartProvider: React.FC = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, initialCart);

    return (
        <CartContext.Provider value={{ cart, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personnalisé pour utiliser le CartContext
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
