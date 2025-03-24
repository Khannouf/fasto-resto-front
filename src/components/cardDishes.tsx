import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { X, PlusCircle, MinusCircle, Plus } from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DishFormSchema } from "../types/type";


const availableIngredients = [
    { id: 1, name: "TOMATE" },
    { id: 2, name: "MOZZARELLA" },
    { id: 3, name: "BASILIC" },
    { id: 4, name: "POULET" },
    { id: 5, name: "CHAMPIGNONS" },
];

export const CardDishes = ({ onClose }: { onClose: () => void }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [search, setSearch] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<{ id: number; name: string; quantity: number }[]>([]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const addIngredient = (input: string) => {
        if (!input.trim()) return;
        const inputUpper = input.toUpperCase();

        const existingIngredient = availableIngredients.find((ing) => ing.name === inputUpper);
        const newIngredient = existingIngredient
            ? { ...existingIngredient, quantity: 1 }  // 🔥 Ajoute la quantité
            : { id: Date.now(), name: inputUpper, quantity: 1 };

        setIngredients((prev) => {
            if (prev.some((ing) => ing.name === newIngredient.name)) return prev;
            return [...prev, newIngredient];
        });

        setValue("ingredients", [...ingredients, newIngredient]); // ✅ Stocke dans React Hook Form
        setSearch("");
    };


    const removeIngredient = (id: number) => {
        setIngredients(ingredients.filter((ing) => ing.id !== id));
    };

    const updateQuantity = (id: number, change: number) => {
        setIngredients((prev) =>
            prev.map((ing) =>
                ing.id === id ? { ...ing, quantity: Math.max(1, ing.quantity + change) } : ing
            )
        );
    };

    const handleSubmitForm = () => {
        console.log("Nouveau plat :", { name, price, ingredients });
        onClose();
    };

    const imageValidation = z
        .instanceof(File) // Vérifie si c'est un objet de type File
        .refine((file) => file.type.startsWith("image/"), {
            message: "Le fichier doit être une image",
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, { // Limite à 5Mo
            message: "L'image ne doit pas dépasser 5 Mo",
        });

    const ingredientSchema = z.object({
        name: z.string(),
        quantity: z.number().min(1, "La quantité doit être au moins 1"),
    });

    const dishSchema = z.object({
        name: z.string().nonempty({message: "Vous devez nommer votre plat"}),
        description: z.string(),
        price: z.number({message: "Le rendu est un chiffre"}),
        image: imageValidation.optional(),
        ingredients: z
            .array(ingredientSchema)
            .min(1, { message: "Vous devez ajouter au moins un ingrédient" }),

    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(dishSchema) });


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "backInOut" }}
                className="relative w-full max-w-[90vw] md:max-w-[400px] h-auto max-h-[90vh]"
            >
                <Card className="w-full bg-white shadow-xl rounded-lg p-4 md:p-5 overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 bg-white text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <CardHeader>
                        <CardTitle>Ajouter un Plat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
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
                                type="number"
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

                            <div>
                                <p className="text-sm font-semibold mb-2">Ingrédients :</p>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Rechercher ou ajouter un ingrédient..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient(search))}
                                    />
                                    {search && (
                                        <div className="absolute bg-white border rounded-md mt-1 w-full max-h-40 overflow-auto shadow-md z-10">
                                            {availableIngredients
                                                .filter((ing) => ing.name.includes(search.toUpperCase()))
                                                .map((ingredient) => (
                                                    <div
                                                        key={ingredient.id}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                                                        onClick={() => addIngredient(ingredient.name)}
                                                    >
                                                        {ingredient.name} <PlusCircle className="w-4 h-4 text-green-500" />
                                                    </div>
                                                ))}
                                            <div
                                                className="p-2 bg-blue-100 text-blue-700 cursor-pointer flex justify-between"
                                                onClick={() => addIngredient(search)}
                                            >
                                                Ajouter "{search.toUpperCase()}" <Plus className="w-4 h-4" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <ScrollArea className="mt-2 max-h-[150px] overflow-y-auto border rounded-md p-2">
                                    {ingredients.length > 0 ? (
                                        ingredients.map((ingredient) => (
                                            <div key={ingredient.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2">
                                                <span className="font-medium">{ingredient.name}</span>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        className="bg-white hover:bg-slate-100 hover:border-slate-100"
                                                        onClick={() => updateQuantity(ingredient.id, -1)}
                                                        disabled={ingredient.quantity === 1}
                                                    >
                                                        <MinusCircle className="w-4 h-4 text-gray-600" />
                                                    </Button>

                                                    <span className="w-6 text-center">{ingredient.quantity}</span>

                                                    <Button
                                                        size="icon"
                                                        className="bg-white hover:bg-slate-100 hover:border-slate-100"
                                                        onClick={() => updateQuantity(ingredient.id, 1)}
                                                    >
                                                        <PlusCircle className="w-4 h-4 text-gray-600" />
                                                    </Button>

                                                    <X className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => removeIngredient(ingredient.id)} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center">Aucun ingrédient ajouté</p>
                                    )}
                                </ScrollArea>
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-2">Image du plat :</p>
                                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                                {image && <img src={image} alt="Plat" className="mt-2 w-full h-32 object-cover rounded-md" />}
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
            </motion.div>
        </div>
    );
};
