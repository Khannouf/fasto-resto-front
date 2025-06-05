import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "../context/userContext";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "../hooks/use-toast";
import { useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";

const api = import.meta.env.VITE_API_URL

export const CardMenu = ({ onClose }: { onClose: () => void }) => {
    const { user } = useUserContext();
    const token = user?.token
    const [nbElement, setNbElement] = useState(0)


    const { toast } = useToast()

    const menuSchema = z.object({
        name: z.string(),
        price: z.number(),
    });

    type menuType = z.infer<typeof menuSchema>
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<menuType>({
        resolver: zodResolver(menuSchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (menu: menuType) =>
            fetch(`${api}/categorie`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(menu)
            }).then((res) => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries(["categories"]);
        },

    })


    const handleSubmitForm = (data: menuType) => {
        mutation.mutate(data, {
            onSuccess: () => {
                queryClient.invalidateQueries(["categories"]); // refetch
                toast({
                    title: "Succès",
                    description: "Catégorie ajoutée avec succès !",
                    variant: "success", // Type "success"
                    duration: 1000, // Durée en ms
                    className: "bg-green-500 text-white p-4 rounded-lg shadow-lg font-semibold", // Classes Tailwind
                });
                onClose(); // ferme uniquement si tout s’est bien passé
            },
            onError: (error) => {
                console.error("Erreur lors de l'ajout :", error);
                alert("Une erreur est survenue lors de la création de la catégorie.");
            }
        });
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }} // Départ invisible et légèrement en haut
                animate={{ opacity: 1, scale: 1, y: 0 }} // Apparition fluide
                exit={{ opacity: 0, scale: 0.9, y: 10 }} // Effet en sortie
                transition={{ duration: 0.3, ease: "backInOut" }} // Temps et fluidité
            >
                <Card className="w-[70vw] bg-white shadow-lg rounded-lg p-4">
                    <CardHeader>
                        <CardTitle>Nouveau menu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Nom du menu"
                                required
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                            <Input
                                type="number"
                                placeholder="Prix du menu"
                                required
                                {...register('price')}
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                            <Input
                                type="number"
                                placeholder="Nombre d'élément"
                                required
                                onChange={(e) => setNbElement(Number(e.target.value))}
                            />
                            <ScrollArea
                                className="max-h-[300px] overflow-y-auto mt-4 border rounded-md p-4 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-gray-100"
                            >
                                <div className="space-y-4 pr-2">
                                    {Array.from({ length: nbElement }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Choisir une catégorie
                                                </label>
                                                <select
                                                    name={`plat-${i}`}
                                                    required
                                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    <option value="">-- Sélectionner --</option>
                                                    <option value="pizza">Pizza</option>
                                                    <option value="burger">Burger</option>
                                                    <option value="pasta">Pâtes</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Choisir un plat
                                                </label>
                                                <select
                                                    name={`accompagnement-${i}`}
                                                    required
                                                    className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    <option value="">-- Sélectionner --</option>
                                                    <option value="frites">Frites</option>
                                                    <option value="salade">Salade</option>
                                                    <option value="riz">Riz</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>



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
