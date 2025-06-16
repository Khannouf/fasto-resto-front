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
import { useEffect, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  ApiResponseCategorie,
  ApiResponseDish,
  Categorie,
  Dish,
} from "../types/type";

const api = import.meta.env.VITE_API_URL;

export const CardMenu = ({ onClose }: { onClose: () => void }) => {
  const { user } = useUserContext();
  const restaurantId = user?.restaurantId;
  const token = user?.token;
  const [nbElement, setNbElement] = useState(0);
  const [categories, setCategories] = useState<Categorie[] | null>([]);
  const [dishes, setDish] = useState<Dish[] | null>([]);
  const [selectedCategories, setSelectedCategories] = useState<(number | "")[]>(
    []
  );
  const [choicesPerElement, setChoicesPerElement] = useState<(number | "")[][]>(
    []
  );
  const [selectedChoices, setSelectedChoices] = useState<
    { categorieId: number; dishId: number }[][]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const addChoice = (elementIndex: number) => {
    setChoicesPerElement((prev) => {
      const newChoices = [...prev];
      newChoices[elementIndex] = [...newChoices[elementIndex], ""];
      return newChoices;
    });
  };

  const elementInMenu = z.object({
    idCategorie: z.number(),
    idPlat: z.number(),
  });

  const menuSchema = z.object({
    name: z.string(),
    price: z.number(),
    elementInMenu: z.array(elementInMenu),
  });

  type menuType = z.infer<typeof menuSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<menuType>({
    resolver: zodResolver(menuSchema),
  });

  useEffect(() => {
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
    const fetchDishes = async () => {
      try {
        const response = await fetch(
          `${api}/dishes/allByRestaurant/${restaurantId}`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données");
        const data: ApiResponseDish = await response.json();
        // Vérifier si l'API retourne un tableau ou un objet unique
        const dishesArray = Array.isArray(data.data) ? data.data : [data.data];
        setDish(dishesArray);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
    fetchCategories();
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (menu: menuType) =>
      fetch(`${api}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menu),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const handleSubmitForm = (data: menuType) => {
    mutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(["menu"]); // refetch
        toast({
          title: "Succès",
          description: "Menu ajoutée avec succès !",
          variant: "success", // Type "success"
          duration: 1000, // Durée en ms
          className:
            "bg-green-500 text-white p-4 rounded-lg shadow-lg font-semibold", // Classes Tailwind
        });
        onClose(); // ferme uniquement si tout s’est bien passé
      },
      onError: (error) => {
        console.error("Erreur lors de l'ajout :", error);
        alert("Une erreur est survenue lors de la création du menu.");
      },
    });
  };

  return (
    <div className="fixed z-[1000] inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              className="space-y-4"
            >
              <Input
                type="text"
                placeholder="Nom du menu"
                required
                {...register("name")}
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
                {...register("price")}
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
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setNbElement(value);
                  setSelectedCategories(Array(value).fill("")); // garde si besoin
                  setChoicesPerElement(
                    Array.from({ length: value }, () => [""])
                  );
                }}
              />
              <ScrollArea className="max-h-[300px] overflow-y-auto mt-4 border rounded-md p-4 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-gray-100">
                <div className="space-y-4 pr-2">
                  {Array.from({ length: nbElement }).map((_, elementIndex) => (
                    <div key={elementIndex}>
                      <h5>Pour l'élément numéro {elementIndex + 1}</h5>

                      {(choicesPerElement[elementIndex] || [""]).map(
                        (_, choiceIndex) => (
                          <div
                            key={choiceIndex}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm mb-2"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Choisir une catégorie
                              </label>
                              <select
                                name={`plat-${elementIndex}-${choiceIndex}`}
                                required
                                className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                onChange={(e) => {
                                  const newChoices = [...selectedCategories];
                                  newChoices[elementIndex] =
                                    Number(e.target.value) || "";
                                  setSelectedCategories(newChoices);
                                }}
                              >
                                <option value="">-- Sélectionner --</option>
                                {categories &&
                                  categories.map((category) => (
                                    <option
                                      key={category.id}
                                      value={category.id}
                                    >
                                      {category.name}
                                    </option>
                                  ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Choisir un plat
                              </label>
                              <select
                                name={`accompagnement-${elementIndex}-${choiceIndex}`}
                                required
                                className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                <option value="">-- Sélectionner --</option>
                                {dishes &&
                                  dishes
                                    .filter((dish) =>
                                      selectedCategories[elementIndex]
                                        ? dish.categorieId ===
                                          selectedCategories[elementIndex]
                                        : true
                                    )
                                    .map((dish) => (
                                      <option key={dish.id} value={dish.id}>
                                        {dish.name}
                                      </option>
                                    ))}
                              </select>
                            </div>
                          </div>
                        )
                      )}

                      <div className="flex justify-start mb-4">
                        <Button
                          type="button"
                          onClick={() => addChoice(elementIndex)}
                          variant="ghost"
                          className="text-red-500"
                        >
                          ➕ Ajouter un choix pour cet élément
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      const allChoices: {
                        categorieId: string;
                        dishId: string;
                      }[][] = [];

                      for (let i = 0; i < nbElement; i++) {
                        const elementChoices: {
                          categorieId: string;
                          dishId: string;
                        }[] = [];

                        const selects = document.querySelectorAll(
                          `select[name^="plat-${i}-"], select[name^="accompagnement-${i}-"]`
                        );

                        for (let j = 0; j < selects.length; j += 2) {
                          const catSelect = selects[j] as HTMLSelectElement;
                          const dishSelect = selects[
                            j + 1
                          ] as HTMLSelectElement;

                          elementChoices.push({
                            categorieId: catSelect?.value || "",
                            dishId: dishSelect?.value || "",
                          });
                        }

                        allChoices.push(elementChoices);
                      }

                      console.log("Tous les choix du menu :", allChoices);
                    }}
                  >
                    🔍 Voir tous les choix
                  </Button>
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
