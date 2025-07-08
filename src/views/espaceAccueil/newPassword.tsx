import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { NewPasswordFormSchema, NewPasswordFormType } from "../../types/type";

const api_url = import.meta.env.VITE_API_URL;
const front_url = import.meta.env.VITE_FRONT_URL;

type newPasswordProps = {
  email: string;
  code: string;
};

export const NewPassword = ({email, code }: newPasswordProps) => {
    const [serverError, setServerError] = useState<string | null>(null);

    console.log(email, code);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NewPasswordFormType>({ resolver: zodResolver(NewPasswordFormSchema) });

    const handleSubmitForm = async (data: NewPasswordFormType) => {
        setServerError(null); // Réinitialiser l'erreur à chaque tentative

        try {
            const response = await fetch(`${api_url}/auth/reset-password-confirmation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    code: code,
                    password: data.password,
                }),
            });

            if (!response.ok) {
                throw new Error("Une erreur est survenue.");
            }
            
            const result = await response.json();
            // Rediriger vers la page de connexion après succès
            window.location.replace(front_url + "/login");
        } catch (error: any) {
            setServerError(error.message); // Afficher l'erreur sous le bouton
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
                        Nouveau mot de passe
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Définissez votre nouveau mot de passe
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
                    <fieldset disabled={isSubmitting} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                                placeholder="Entrez votre nouveau mot de passe"
                                {...register("password")}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmer le mot de passe
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                                placeholder="Confirmez votre nouveau mot de passe"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin m-auto" /> : "Confirmer le nouveau mot de passe"}
                            </button>
                        </div>

                        {/* Affichage du message d'erreur si la requête échoue */}
                        {serverError && (
                            <p className="text-red-500 text-center text-sm font-semibold bg-rose-100 h-12 m-4 rounded-lg flex items-center justify-center">
                                {serverError}
                            </p>
                        )}

                        {/* Affichage des règles de mot de passe */}
                        <div className="mt-4 text-sm text-gray-600">
                            <p className="font-medium">Le mot de passe doit contenir :</p>
                            <ul className="mt-2 space-y-1 text-xs">
                                <li>• Au moins 8 caractères</li>
                                <li>• Au moins une majuscule</li>
                                <li>• Au moins un caractère spécial</li>
                            </ul>
                        </div>
                    </fieldset>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Vous vous souvenez de votre mot de passe ?{" "}
                    <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
};
