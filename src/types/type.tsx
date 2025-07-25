import { z } from "zod";

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
  name: z.string(),
});

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
  verifPrice: () => Promise<void>; // Ajout de la méthode verifPrice
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
  email: string;
  password: string;
}

export const SendCodeSchema = z.object({
  email: z.string().email({ message: "L'adresse e-mail n'est pas valide" }),
});
export type SendCodeType = z.infer<typeof SendCodeSchema>;

export interface CodeSchema {
  code: string;
}

export const NewPasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(
      /[^a-zA-Z0-9]/,
      "Le mot de passe doit contenir au moins un caractère spécial"
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});
export type NewPasswordFormType = z.infer<typeof NewPasswordFormSchema>;

export interface RegisterFormSchema {
  restaurantName: string;
  description: string;
  adresse: string;
  postalCode: number;
  city: string;
  phone: string;
  email: string;
  password: string;
  confirmationPassword: string;
}

export interface ConnectedUser {
  token: string;
  restaurantId: number;
  actif: number;
}

export interface DishFormSchema {
  name: string;
  description: string;
  price: number;
  ingredients: Ingredient;
  img: string;
}

export interface ApiResponseIngredients {
  type: string;
  data: Ingredient;
}

// Schéma pour un menu
const menuSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  nbelement: z.number(),
  dish: z.array(
    z.object({
      dishId: z.number(),
      configuration: z.number(),
    })
  ),
});

export const orderBody = z.object({
  total: z.number(),
  state: z.string(),
  tableId: z.number(),
  orderJoin: z
    .object({
      menu: z.optional(z.array(menuSchema)), // Menu est optionnel
      dish: z.optional(
        z.array(
          z.object({
            id: z.number(),
            nbelement: z.number(),
          })
        )
      ), // Dish est optionnel
    })
    .refine(
      (data) => data.menu?.length || data.dish?.length, // Vérifie qu'au moins un des deux est présent
      {
        message: "Au moins un menu ou un plat doit être présent.",
        path: ["orderJoin"], // Indique où l'erreur se produit
      }
    ),
});

export type orderBodyType = z.infer<typeof orderBody>

export interface ApiResponseOrder {
  type: string,
  data:{
    id: number,
    sequentialId: number,
    restaurantId: number,
    total: number,
    state: string,
    createdAt: Date,
    updatedAt: Date,
  }
}

const dishSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  categorieId: z.number(),
  restaurantId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const orderJoinSchema = z.object({
  orderJoinId: z.number(),
  orderId: z.number(),
  menuId: z.number(),
  dishId: z.number(),
  nbElement: z.number(),
  restaurantId: z.number(),
  menu: z.nullable(z.any()), // Menu est null dans cet exemple
  dish: dishSchema,
  item: itemSchema,
});

const orderSchema = z.object({
  id: z.number(),
  sequentialId: z.number(),
  restaurantId: z.number(),
  total: z.number(),
  state: z.string(),
  tableId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  orderJoin: z.array(orderJoinSchema),
});

const apiResponseOrderByIdSchema = z.object({
  type: z.literal("success"),
  data: z.array(orderSchema),
});
export type orderJoinType = z.infer<typeof orderJoinSchema>
export type orderType = z.infer<typeof orderSchema>
export type apiResponseOrderByIdType = z.infer<typeof apiResponseOrderByIdSchema>