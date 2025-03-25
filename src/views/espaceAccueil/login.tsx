import React, { useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "../../types/type";
import { Loader2 } from "lucide-react";
import { useUserContext } from "../../context/userContext";

const api_url = import.meta.env.VITE_API_URL

export const Login = () => {
  const { user, addUser }  = useUserContext()


  const zodFormSchema: ZodType<LoginFormSchema> = z.object({
    email: z.string().email({ message: "L'adresse e-mail n'est pas valide" }),
    password: z
      .string()
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({ resolver: zodResolver(zodFormSchema) });

  const handleSubmitForm = async (data: LoginFormSchema) => {
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
      const newUser = {
        token: result.token,
        restaurantId: result.restaurant.sub,
        actif: result.restaurant.actif
      }
      addUser(newUser)
      
      
      
  
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };
  
  

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Bienvenue sur FastoResto !
          </h2>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <fieldset disabled={isSubmitting} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <Input
                type="password"
                id="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin m-auto" />
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>
          </fieldset>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas de compte ?{" "}
          <Link
            to="/register"
            className="font-medium text-red-600 hover:text-red-500"
          >
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};
