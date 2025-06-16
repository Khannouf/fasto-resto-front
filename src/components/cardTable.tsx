import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "../context/userContext";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "../hooks/use-toast";

const api = import.meta.env.VITE_API_URL

export const CardTable = ({ onClose }: { onClose: () => void }) => {
    const { user } = useUserContext();
    const token = user?.token

    const { toast } = useToast()

    const TableSchema = z.object({
        numeroTable: z.number(),
    });

    type tableType = z.infer<typeof TableSchema>
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<tableType>({
        resolver: zodResolver(TableSchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (table: tableType) =>
            fetch(`${api}/table`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(table)
            }).then((res) => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries(["tables"]);
        },

    })


    const handleSubmitForm = (data: tableType) => {
        mutation.mutate(data, {
            onSuccess: () => {
                queryClient.invalidateQueries(["tables"]); // refetch
                toast({
                  title: "Succès",
                  description: "Table ajoutée avec succès !",
                  variant: "success", // Type "success"
                  duration: 1000, // Durée en ms
                  className: "bg-green-500 text-white p-4 rounded-lg shadow-lg font-semibold", // Classes Tailwind
                });
                onClose(); // ferme uniquement si tout s’est bien passé
            },
            onError: (error) => {
                console.error("Erreur lors de l'ajout :", error);
                alert("Une erreur est survenue lors de la création de la table.");
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
                <Card className="w-96 bg-white shadow-lg rounded-lg p-4">
                    <CardHeader>
                        <CardTitle>Nouvelle Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Numéro de la table"
                                required
                                {...register('numeroTable', { valueAsNumber: true })}
                            />
                            {errors.numeroTable && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.numeroTable.message}
                                </p>
                            )}
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
