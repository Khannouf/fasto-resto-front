// Types pour les ingrédients
export type Ingredient = {
    ingredientId: number;
    quantity: string;
};

// Types pour un plat (Dish)
export type Dish = {
    id: number;
    name: string;
    categorieid: number;
    price: number;
    nbelement: number;
};

// Types pour les éléments de menu (MenuDish)
export type MenuDish = {
    dishId: number;
    configuration: number;
};

// Types pour un menu
export type Menu = {
    id: number;
    name: string;
    price: number;
    dish: MenuDish[];
    nbelement: number;
};

// Type pour un panier
export type Cart = {
    dishes: Dish[];
    menus: Menu[];
};

// Actions possibles sur le panier
export type CartAction =
    | { type: "ADD_DISH"; dish: Dish }
    | { type: "REMOVE_DISH"; dishId: number }
    | { type: "ADD_MENU"; menu: Menu }
    | { type: "REMOVE_MENU"; menuId: number };
