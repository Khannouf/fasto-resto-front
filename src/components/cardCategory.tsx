import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export const CardCategory = ({ onClose }: { onClose: () => void }) => {
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Nouvelle catégorie :", name);
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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Nom de la catégorie"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                required
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
