import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { X, PlusCircle, MinusCircle, Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ApiResponseCategorie,
    ApiResponseIngredients,
    Categorie,
    DishFormSchema,
    Ingredient,
    SendIngredient,
} from "../types/type";
import { Mosaic } from "react-loading-indicators";
import { useUserContext } from "../context/userContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";

const api = import.meta.env.VITE_API_URL;

const mergeArrays = (itemsWithId: Ingredient[], itemsWithQuantity: { name: string; quantity: number }[]) => {
    return itemsWithQuantity.map(itemQ => {
        const match = itemsWithId.find(itemId => itemId.name === itemQ.name);
        if (match) {
            return {
                id: match.id, // Met null si pas trouvé
                name: itemQ.name,
                quantity: itemQ.quantity
            };
        }
    });
};

export const CardDishes = ({ onClose }: { onClose: () => void }) => {
    const queryClient = useQueryClient();
    const { user } = useUserContext();
    const token = user?.token;
    const restaurantId = user?.restaurantId;
    const [categories, setCategories] = useState<Categorie[] | null>([]);
    const [search, setSearch] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<
        { id: number; name: string; quantity: number }[]
    >([]);
    const [availableIngredients, setAvailableIngredients] = useState<Ingredient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast()

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(URL.createObjectURL(file)); // Pour affichage
            setValue("image", file); // Pour validation
        }
    };

    const addIngredient = (input: string) => {
        if (!input.trim()) return;
        const inputUpper = input.toUpperCase();
        if (availableIngredients) {
            const existingIngredient = availableIngredients.find(
                (ing: { name: string }) => ing.name === inputUpper
            );
            const newIngredient = existingIngredient
                ? { ...existingIngredient, quantity: 1 }
                : { id: Date.now(), name: inputUpper, quantity: 1 };

            setIngredients((prevIngredients) => {
                const updatedIngredients = prevIngredients.some(
                    (ing) => ing.name === newIngredient.name
                )
                    ? prevIngredients
                    : [...prevIngredients, newIngredient];

                setValue("ingredients", updatedIngredients);
                return updatedIngredients;
            });
            setSearch("");
        }
    };

    const removeIngredient = (id: number) => {
        setIngredients(ingredients.filter((ing) => ing.id !== id));
    };

    const updateQuantity = (id: number, change: number) => {
        setIngredients((prev) =>
            prev.map((ing) =>
                ing.id === id
                    ? { ...ing, quantity: Math.max(1, ing.quantity + change) }
                    : ing
            )
        );
    };

    const imageValidation = z
        .instanceof(File, { message: "Une image est obligatoire pour " }) // Vérifie si c'est un objet de type File
        .refine((file) => file.type.startsWith("image/"), {
            message: "Le fichier doit être une image",
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            // Limite à 5Mo
            message: "L'image ne doit pas dépasser 5 Mo",
        });

    const ingredientSchema = z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number().min(1, "La quantité doit être au moins 1"),
    });

    const dishSchema = z.object({
        name: z.string().nonempty({ message: "Vous devez nommer votre plat" }),
        description: z.string().optional(),
        category: z.string().nonempty({ message: "Choisissez une catégorie" }),
        price: z.number({ message: "Le rendu est un chiffre" }),
        image: imageValidation.optional(),
        ingredients: z
            .array(ingredientSchema)
            .min(1, { message: "Vous devez ajouter au moins un ingrédient" }),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(dishSchema),
        defaultValues: { ingredients: [] },
    });
    type dischType = z.infer<typeof dishSchema>;

    const sendIngredients = async (ingredients: SendIngredient[]) => {
        try {
            const response = await fetch(`${api}/ingredients/many`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(ingredients),
            });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();
            return data.data; // 🔥 On retourne les données
        } catch (error) {
            console.error("Erreur lors de l'envoi des ingrédients :", error);
            return null; // En cas d'erreur, on retourne `null`
        }
    };



    useEffect(() => {
        const fetchIgredients = async () => {
            try {
                const response = await fetch(`${api}/ingredients`);
                if (!response.ok)
                    throw new Error("Erreur lors de la récupération des données");
                const data: ApiResponseIngredients = await response.json();
                setAvailableIngredients(data.data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${api}/categorie/restaurant/${restaurantId}`
                );
                if (!response.ok)
                    throw new Error("Erreur lors de la récupération des données");
                const data: ApiResponseCategorie = await response.json();
                // Vérifier si l'API retourne un tableau ou un objet unique
                const categoriesArray = Array.isArray(data.data)
                    ? data.data
                    : [data.data];
                setCategories(categoriesArray);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchIgredients();
        fetchCategories();
    }, []);

    const mutationAddDish = useMutation({
        mutationFn: (data: dischType) =>
            fetch(`${api}/dishes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            }).then((res) => {
                if (!res.ok) throw new Error("Erreur lors de la création du plat");
                return res.json(); // Attend une réponse JSON avec l'ID du plat
            }),
    });
    
    const mutationAddDishImg = useMutation({
        mutationFn: async ({ image, id }: { image: File; id: number }) => {
            const formData = new FormData();
            formData.append("image", image); // Clé "image" pour correspondre à FileInterceptor('image')
            formData.append("id", String(id)); // S'assurer que dishId est bien une string
    
            return fetch(`${api}/dishes/addImage`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, // NE PAS METTRE Content-Type, car FormData le gère
                },
                body: formData,
            }).then((res) => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.message || "Erreur lors de l’upload de l’image") });
                }
                return res.json();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["dish", restaurantId]);
        },
        onError: (error) => {
            console.error("Erreur lors de l'upload de l'image :", error);
            alert("L’image n’a pas pu être envoyée.");
        }
    });
    
    
    const handleSubmitForm = async (data: dischType) => {
        const ingredientsForm = data.ingredients.map((ingredient) => ({
            name: ingredient.name,
        }));
    
        const formIngredients = await sendIngredients(ingredientsForm);
        if (formIngredients) {
            const mergedItems = mergeArrays(formIngredients, ingredients).filter(item => item !== undefined);
            const newData = { ...data, ingredients: mergedItems };
            
            const formattedData = {
                name: data.name,
                description: data.description,
                categorieId: Number(data.category),
                price: data.price,
                image: data.image,
                ingredients: newData.ingredients.map(ingredient => ({
                    ingredientId: ingredient.id,
                    quantity: String(ingredient.quantity),
                })),
            };
    
            // 1️⃣ Envoie du plat
            mutationAddDish.mutate(formattedData, {
                onSuccess: (dishResponse) => {
                  toast({
                    title: "Succès",
                    description: "Catégorie ajoutée avec succès !",
                    variant: "success", // Type "success"
                    duration: 1000, // Durée en ms
                    className: "bg-green-500 text-white p-4 rounded-lg shadow-lg font-semibold", // Classes Tailwind
                  });
                    
                    if (formattedData.image) {
                        console.log(formattedData.image);
                        console.log(dishResponse.data.id);
                        
                        
                        // 2️⃣ Envoie de l'image une fois le plat créé
                        mutationAddDishImg.mutate(
                            { image: formattedData.image, id: dishResponse.data.id },
                            {
                                onSuccess: () => {
                                    queryClient.invalidateQueries(["dish", restaurantId]);
                                    onClose(); // Fermer seulement si tout est réussi
                                },
                                onError: (error) => {
                                    console.error("Erreur lors de l'ajout de l’image :", error);
                                    alert("Le plat a été ajouté, mais l’image n’a pas pu être envoyée.");
                                },
                            }
                        );
                    } else {
                        onClose();
                    }
                },
                onError: (error) => {
                    console.error("Erreur lors de l'ajout du plat :", error);
                    alert("Une erreur est survenue lors de la création du plat.");
                },
            });
        }
    };
    


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "backInOut" }}
                className="relative w-full max-w-[90vw] md:max-w-[400px] h-auto max-h-[90vh]"
            >
                {loading ? (
                    <div className="flex justify-center items-center h-screen w-screen">
                        <Mosaic
                            color="#35ca35"
                            size="medium"
                            text="chargement..."
                            textColor="#000000"
                        />
                    </div>
                ) : (
                    <Card className="w-full bg-white shadow-xl rounded-lg p-4 md:p-5 flex flex-col max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 bg-white text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <CardHeader>
                            <CardTitle>Ajouter un Plaat</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto">
                            <form
                                onSubmit={handleSubmit(handleSubmitForm)}
                                className="space-y-4"
                            >
                                <Input
                                    type="text"
                                    placeholder="Nom du plat"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                    </p>
                                )}

                                <Input
                                    type="float"
                                    placeholder="Prix (€)"
                                    {...register("price", {
                                        valueAsNumber: true,
                                    })}
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.price.message}
                                    </p>
                                )}
                                <Select onValueChange={(value: string) => setValue("category", value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionnez une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories &&
                                            categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.category.message}
                                    </p>
                                )}

                                <Textarea
                                    placeholder="Description du plat"
                                    className="w-full"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.description.message}
                                    </p>
                                )}

                                <div>
                                    <p className="text-sm font-semibold mb-2">Ingrédients :</p>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="Rechercher ou ajouter un ingrédient..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                (e.preventDefault(), addIngredient(search))
                                            }
                                        />
                                        {search && (
                                            <div className="absolute bg-white border rounded-md mt-1 w-full max-h-40 overflow-auto shadow-md z-10">
                                                {availableIngredients
                                                    .filter((ing) =>
                                                        ing.name.includes(search.toUpperCase())
                                                    )
                                                    .map((ingredient) => (
                                                        <div
                                                            key={ingredient.id}
                                                            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                                                            onClick={() => addIngredient(ingredient.name)}
                                                        >
                                                            {ingredient.name}{" "}
                                                            <PlusCircle className="w-4 h-4 text-green-500" />
                                                        </div>
                                                    ))}
                                                <div
                                                    className="p-2 bg-blue-100 text-blue-700 cursor-pointer flex justify-between"
                                                    onClick={() => addIngredient(search)}
                                                >
                                                    Ajouter "{search.toUpperCase()}"{" "}
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.ingredients && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.ingredients.message}
                                        </p>
                                    )}

                                    <ScrollArea className="mt-2 max-h-[150px] overflow-y-auto border rounded-md p-2">
                                        {ingredients.length > 0 ? (
                                            ingredients.map((ingredient) => (
                                                <div
                                                    key={ingredient.id}
                                                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
                                                >
                                                    <span className="font-medium">{ingredient.name}</span>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            className="bg-white hover:bg-slate-100 hover:border-slate-100"
                                                            onClick={() => updateQuantity(ingredient.id, -1)}
                                                            disabled={ingredient.quantity === 1}
                                                        >
                                                            <MinusCircle className="w-4 h-4 text-gray-600" />
                                                        </Button>

                                                        <span className="w-6 text-center">
                                                            {ingredient.quantity}
                                                        </span>

                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            className="bg-white hover:bg-slate-100 hover:border-slate-100"
                                                            onClick={() => updateQuantity(ingredient.id, 1)}
                                                        >
                                                            <PlusCircle className="w-4 h-4 text-gray-600" />
                                                        </Button>

                                                        <X
                                                            className="w-4 h-4 text-red-500 cursor-pointer"
                                                            onClick={() => removeIngredient(ingredient.id)}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center">
                                                Aucun ingrédient ajouté
                                            </p>
                                        )}
                                    </ScrollArea>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold mb-2">Image du plat :</p>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    {image && (
                                        <img
                                            src={image}
                                            alt="Plat"
                                            className="mt-2 w-12 h-12 object-cover rounded-md"
                                        />
                                    )}
                                    {errors.image && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.image.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={onClose}>
                                        Annuler
                                    </Button>
                                    <Button type="submit">Ajouter</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </div>
    );
};
