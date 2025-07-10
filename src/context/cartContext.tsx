import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  CartContextType,
  Dish,
  Menu,
  CartState,
  DishCartContext,
} from "../types/type";

const api = import.meta.env.VITE_API_URL;

// Définition des actions possibles
type CartAction =
  | { type: "ADD_COMMENT"; payload: string }
  | { type: "ADD_DISH"; payload: Dish }
  | { type: "REMOVE_DISH"; payload: number }
  | { type: "ADD_MENU"; payload: Menu }
  | { type: "REMOVE_MENU"; payload: number }
  | { type: "SET_TOTAL"; payload: number }; // Action pour mettre à jour le total

// Reducer pour gérer l'état du panier
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_COMMENT": {
      return {
        ...state,
        comment: action.payload,
      };
    }

    case "ADD_DISH": {
      const existingDishIndex = state.dishes.findIndex(
        (d) => d.dish.id === action.payload.id
      );

      let updatedDishes;

      if (existingDishIndex !== -1) {
        // Si l'élément existe, on incrémente la quantité et le nbElement
        updatedDishes = state.dishes.map((d, index) =>
          index === existingDishIndex
            ? { ...d, quantity: d.quantity + 1, nbElement: d.nbElement + 1 }
            : d
        );
      } else {
        // Sinon, on ajoute le nouvel élément avec une quantité de 1
        updatedDishes = [
          ...state.dishes,
          { dish: action.payload, quantity: 1, nbElement: 1 },
        ];
      }

      const newTotalAddDish = parseFloat(
        (state.total + action.payload.price).toFixed(2)
      );

      return {
        ...state,
        dishes: updatedDishes,
        total: newTotalAddDish,
      };
    }

    case "REMOVE_DISH": {
      const dishIndex = action.payload; // L'index du plat à supprimer
      const removedDish = state.dishes[dishIndex];
      if (!removedDish) return state; // Sécurité : si le plat n'existe pas

      const newTotalRemoveDish = parseFloat(
        (state.total - removedDish.dish.price).toFixed(2)
      );

      let updatedDishes;
      if (removedDish.quantity > 1) {
        // Si la quantité est > 1, on décrémente seulement
        updatedDishes = state.dishes.map((d, index) =>
          index === dishIndex
            ? { ...d, quantity: d.quantity - 1, nbElement: d.nbElement - 1 }
            : d
        );
      } else {
        // Sinon, on supprime complètement l'élément
        updatedDishes = state.dishes.filter((_, index) => index !== dishIndex);
      }

      return {
        ...state,
        dishes: updatedDishes,
        total: newTotalRemoveDish,
      };
    }

    case "ADD_MENU": {
      const newTotalAddMenu = parseFloat(
        (state.total + action.payload.price).toFixed(2)
      );
      return {
        ...state,
        menus: [...state.menus, action.payload],
        total: newTotalAddMenu,
      };
    }

    case "REMOVE_MENU": {
      const removedMenu = state.menus.find(
        (menu) => menu.id === action.payload
      );
      const newTotalRemoveMenu = parseFloat(
        (state.total - (removedMenu?.price || 0)).toFixed(2)
      );
      return {
        ...state,
        menus: state.menus.filter((menu) => menu.id !== action.payload),
        total: newTotalRemoveMenu,
      };
    }

    case "SET_TOTAL": {
      return {
        ...state,
        total: action.payload,
      };
    }

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
    comment: "",
    total: 0,
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fonction pour vérifier les prix et mettre à jour le total
  const verifPrice = async () => {
    let totalVerif = 0;

    await Promise.all(
      state.dishes.map(async (dishContext) => {
        try {
          const response = await fetch(`${api}/dishes/${dishContext.dish.id}`);
          if (!response.ok) throw new Error("Erreur lors de la récupération des données");
          const data = await response.json();

          // Ajoute le prix récupéré multiplié par la quantité au total
          totalVerif += data.data.price * dishContext.quantity;
        } catch (err) {
          console.error("Erreur dans verifPrice :", err);
        }
      })
    );

    // Met à jour le total dans le reducer
    dispatch({ type: "SET_TOTAL", payload: parseFloat(totalVerif.toFixed(2)) });
  };

  // Définition des fonctions du contexte
  const addComment = (comment: string) =>
    dispatch({ type: "ADD_COMMENT", payload: comment });
  const addDish = (dish: Dish) => dispatch({ type: "ADD_DISH", payload: dish });
  const removeDish = (index: number) =>
    dispatch({ type: "REMOVE_DISH", payload: index });
  const addMenu = (menu: Menu) => dispatch({ type: "ADD_MENU", payload: menu });
  const removeMenu = (menuId: number) =>
    dispatch({ type: "REMOVE_MENU", payload: menuId });

  return (
    <CartContext.Provider
      value={{
        ...state,
        addComment,
        addDish,
        removeDish,
        addMenu,
        removeMenu,
        verifPrice, // Expose la fonction verifPrice dans le contexte
      }}
    >
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