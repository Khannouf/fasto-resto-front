import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, SendCodeSchema } from "../../types/type";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useUserContext } from "../../context/userContext";

const api_url = import.meta.env.VITE_API_URL;
const front_url = import.meta.env.VITE_FRONT_URL;

export const SendCode = () => {
    const [emailError, setEmailError] = useState<string | null>(null);

    const zodFormSchema: ZodType<SendCodeSchema> = z.object({
        email: z.string().email({ message: "L'adresse e-mail n'est pas valide" }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SendCodeSchema>({ resolver: zodResolver(zodFormSchema) });

    const handleSubmitForm = async (data: SendCodeSchema) => {
        setEmailError(null); // Réinitialiser l'erreur à chaque tentative

        try {
            const response = await fetch(`${api_url}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                }),
            });

            if (!response.ok) {
                throw new Error("Une erreur est survenue.");
            }

            const result = await response.json();
            window.location.replace(front_url + "/admin/dashboard");
        } catch (error: any) {
            setEmailError(error.message); // Afficher l'erreur sous le bouton
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
                        Mot de passe oublié
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
                    <fieldset disabled={isSubmitting} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Renseignez l'addresse email lié au compte
                            </label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin m-auto" /> : "Valider"}
                            </button>
                        </div>

                        {/* Affichage du message d'erreur si le login échoue */}
                        {emailError && (
                            <p className="text-red-500 text-center text-sm font-semibold bg-rose-100 h-12 m-4 rounded-lg flex items-center justify-center">
                                L'email ne correspond pas
                            </p>
                        )}

                    </fieldset>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Pas de compte ?{" "}
                    <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                        Inscrivez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
};
