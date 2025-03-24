import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { LoginFormSchema, RegisterFormSchema } from "../../types/type";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const api_url = import.meta.env.VITE_API_URL

const login = async (data : unknown) => {
  try {
    const response = await fetch(`${api_url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la connexion");
    }

    const result = await response.json();
    localStorage.setItem('token', result.token)
    console.log(result);
    

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
  }
}

export const Register = () => {
  const [serverError, setServerError] = useState<string | null>(null);

  const zodFormSchema: ZodType<RegisterFormSchema> = z
    .object({
      restaurantName: z
        .string()
        .min(2, { message: "Nom de restaurant trop court" }),
      description: z.string(),
      adresse: z
        .string()
        .min(5, { message: "Le champ adresse est trop court" }),
      postalCode: z.number({ invalid_type_error: "Le code postal doit être un nombre" }),
      city: z.string().min(2, { message: "Le nom de la ville est trop court" }),
      phone: z.string(),
      email: z.string().email({ message: "L'adresse email n'est pas valide" }),
      password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(
          /[^a-zA-Z0-9]/,
          "Le mot de passe doit contenir au moins un caractère spécial"
        ),
      confirmationPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmationPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmationPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({ resolver: zodResolver(zodFormSchema) });

  const handleSubmitForm = async (data: RegisterFormSchema) => {
    setServerError(null);
    const location = `${data.adresse}, ${data.postalCode} ${data.city}`;

    try {
      const response = await fetch(`${api_url}/restaurant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantName: data.restaurantName,
          description: data.description,
          location,
          phone: data.phone,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          // Erreur de conflit (exemple : email déjà utilisé)
          setServerError(errorData.message || "Conflit détecté");
        } else {
          setServerError("Une erreur est survenue lors de l'inscription.");
        }
        return;
      }

      const result = await response.json();
      console.log(result);
      login(data)
      
      
    } catch (err) {
      setServerError("Erreur de connexion au serveur.");
    }
  };


  return (
    <div className="w-screen h-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg h-">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Inscrivez votre restaurant
          </h2>
        </div>
        {serverError && (
          <div className="mt-4 mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
            {serverError}
          </div>
        )}
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <fieldset disabled={isSubmitting} className="space-y-4">
            <div>
              <label
                htmlFor="restaurantName"
                className="block text-sm font-medium text-gray-700"
              >
                Nom du restaurant
              </label>
              <Input
                id="restaurantName"
                {...register("restaurantName")}
                
              />
              {errors.restaurantName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.restaurantName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Input id="description" {...register("description")}  />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="adresse"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse
              </label>
              <Input id="adresse" {...register("adresse")}  />
              {errors.adresse && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.adresse.message}
                </p>
              )}
            </div>

            {/* Postal code et city côte à côte */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code postal
                </label>
                <Input
                  id="postalCode"
                  type="number"
                  {...register("postalCode", { valueAsNumber: true })}
                  
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ville
                </label>
                <Input id="city" {...register("city")}  />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Téléphone
              </label>
              <Input id="phone" {...register("phone")}  />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <Input
                type="password"
                id="password"
                {...register("password")}
                
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmationPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmez le mot de passe
              </label>
              <Input
                type="password"
                id="confirmationPassword"
                {...register("confirmationPassword")}
                
              />
              {errors.confirmationPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmationPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                S'inscrire
              </button>
            </div>
          </fieldset>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <a
            href="/login"
            className="font-medium text-red-600 hover:text-red-500"
          >
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
};
