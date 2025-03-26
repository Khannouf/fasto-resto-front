import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "../context/userContext";
import { useMutation, useQueryClient } from "react-query";

const api = import.meta.env.VITE_API_URL

export const CardCategory = ({ onClose }: { onClose: () => void }) => {
    const { user } = useUserContext();
    const restaurantId = user?.restaurantId
    const token = user?.token

    const categorySchema = z.object({
        name: z.string(),
    });

    type categoryType = z.infer<typeof categorySchema>
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(categorySchema),
    });


    // const sendCategory = async (category: categoryType) => {
    //     try {
    //         const response = await fetch(`${api}/categorie`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`
    //             },
    //             body: JSON.stringify(category)
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Erreur ${response.status}: ${await response.text()}`);
    //         }

    //         const data = await response.json();
    //         console.log("Réponse du serveur :", data);
    //     } catch (error) {
    //         console.error("Erreur lors de l'envoi de la category :", error);
    //     }
    // }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn:(categorySchema) => 
            fetch(`${api}/categorie`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(categorySchema)
            }).then((res) => res.json()),
            onSuccess : (data) => {
                queryClient.invalidateQueries(['categories'])
            }
    })

    
    const handleSubmitForm = (data: categoryType) => {
        mutation.mutate()
        onClose(); // Ferme la carte après la soumission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }} // Départ invisible et légèrement en haut
                animate={{ opacity: 1, scale: 1, y: 0 }} // Apparition fluide
                exit={{ opacity: 0, scale: 0.9, y: 10 }} // Effet en sortie
                transition={{ duration: 0.3, ease: "backInOut" }} // Temps et fluidité
            >
                <Card className="w-96 bg-white shadow-lg rounded-lg p-4">
                    <CardHeader>
                        <CardTitle>Nouvelle Catégorie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Nom de la catégorie"
                                required
                                {...register('name')}
                            />
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
