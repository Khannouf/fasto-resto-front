import { z } from 'zod'

export interface Image {
  id: number;
  filename?: string; // Présent dans "imageRestaurant"
  imagePath?: string; // Présent dans "img"
  restaurantId: number;
}

export interface Restaurant {
  restaurantName: string;
  description: string;
  location: string;
  phone: string;
  imageRestaurant: Image[]; // Liste des images sous "imageRestaurant"
  img: Image[]; // Liste des images sous "img"
}

export interface ApiResponseRestaurant {
  type: string;
  data: Restaurant;
}

export interface Categorie {
  id: number;
  name: string;
}

export interface ApiResponseCategorie {
  type: string;
  data: Categorie;
}
export interface Ingredient {
  id: number;
  name: string;
}

export const ingredientSchema = z.object({
  id: z.number(),
  name: z.string()
})

export const apiResponseIngredientSchema = z.object({
  type: z.string(),
  data: z.array(ingredientSchema), // ✅ data est un tableau !
});


export interface SendIngredient {
  name: string;
}

export interface DishIngredient {
  dishId: number;
  ingredientId: number;
  quantity: string;
  ingredient: Ingredient;
}

export interface DishImage {
  id: number;
  filename: string;
  dishId: number;
}

export interface DishImagePath {
  id: number;
  imagePath: string;
  dishId: number;
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  categorieId: number;
  restaurantId: number;
  dishIngredients: DishIngredient[];
  imageDish: DishImage[];
  imageUrl: string; // Liste des images avec URL complète
}

export interface ApiResponseDish {
  type: string;
  data: Dish;
}

export interface Order {
  sequentialId: number;
  total: number;
  state: string;
  tableId: number;
  orderJoin: {
    menu: Menu[] | []; // Peut être un tableau de Menu ou vide
    dish: Dish[] | []; // Peut être un tableau de Dish ou vide
  };
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  nbelement: number;
  dish: MenuDish[];
}

export interface MenuDish {
  dishId: number;
  configuration: number;
}

export interface DishCartContext {
  dish: Dish;
  nbElement: number;
  quantity: number;
}

export interface CartState {
  menus: Menu[];
  dishes: DishCartContext[];
  comment: string;
  total: number;
}

export interface CartContextType extends CartState {
  addComment: (comment: string) => void;
  addDish: (dish: Dish) => void;
  removeDish: (dishId: number) => void;
  addMenu: (menu: Menu) => void;
  removeMenu: (menuId: number) => void;
}

export interface TablesRestaurant {
  id: number;
  tableNumber: string;
}

export interface ScheduleDayRow {
  day: string;
  start: string;
  end: string;
}


export interface Schedule {
  id: number;
  restaurantId: number;
  mondayStart: string;
  mondayEnd: string;
  tuesdayStart: string;
  tuesdayEnd: string;
  wednesdayStart: string;
  wednesdayEnd: string;
  thursdayStart: string;
  thursdayEnd: string;
  fridayStart: string;
  fridayEnd: string;
  saturdayStart: string;
  saturdayEnd: string;
  sundayStart: string;
  sundayEnd: string;
}

export const daySchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
});

export const scheduleSchema = z.object({
  type: z.literal("success"),
  data: z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
  }),
});



export interface ApiResponseSchedules {
  type: string;
  data: Schedule;
}

export interface LoginFormSchema {
  email: string,
  password: string,
}

export interface RegisterFormSchema {
  restaurantName: string,
  description: string,
  adresse: string, 
  postalCode: number,
  city: string,
  phone: string,
  email: string,
  password: string,
  confirmationPassword: string,
}

export interface ConnectedUser {
  token: string,
  restaurantId: number,
  actif: number
}

export interface DishFormSchema {
  name: string,
  description: string,
  price: number,
  ingredients: Ingredient,
  img: string,
}

export interface ApiResponseIngredients {
  type: string;
  data: Ingredient,
}
