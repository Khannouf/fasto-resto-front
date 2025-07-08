import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "../../types/type";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useUserContext } from "../../context/userContext";

const api_url = import.meta.env.VITE_API_URL;
const front_url = import.meta.env.VITE_FRONT_URL;

export const Login = () => {
  const { addUser } = useUserContext();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [mdpInut, setMdpInput] = useState("password")

  const seeMdp = () => {
    if (mdpInut == "password") {
      setMdpInput('text')
    } else (
      setMdpInput('password')
    )
  }

  const zodFormSchema: ZodType<LoginFormSchema> = z.object({
    email: z.string().email({ message: "L'adresse e-mail n'est pas valide" }),
    password: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({ resolver: zodResolver(zodFormSchema) });

  const handleSubmitForm = async (data: LoginFormSchema) => {
    setLoginError(null); // Réinitialiser l'erreur à chaque tentative

    try {
      console.log(`${api_url}/auth/login`);
      
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
        throw new Error("Identifiants incorrects. Veuillez réessayer.");
      }

      const result = await response.json();
      localStorage.setItem("token", result.token);

      const newUser = {
        token: result.token,
        restaurantId: result.restaurant.sub,
        actif: result.restaurant.actif,
      };
      addUser(newUser);
      window.location.replace(front_url + "/admin/dashboard");
    } catch (error) {
      setLoginError(error.message); // Afficher l'erreur sous le bouton
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
          <fieldset disabled={isSubmitting} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Link to="/send-code" className="text-sm font-medium text-red-600 hover:text-red-500">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="mt-1 relative">
                <Input
                  type={mdpInut}
                  id="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  {...register("password")}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={seeMdp}
                >
                  {mdpInut === "password" ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin m-auto" /> : "Se connecter"}
              </button>
            </div>

            {/* Affichage du message d'erreur si le login échoue */}
            {loginError && (
              <p className="text-red-500 text-center text-sm font-semibold bg-rose-100 h-12 m-4 rounded-lg flex items-center justify-center">
                L'email ou le mot de passe n'est pas bon
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
