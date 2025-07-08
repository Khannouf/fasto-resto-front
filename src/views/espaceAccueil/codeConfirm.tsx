import { useState, useEffect } from "react";
import { ZodType, set, z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CodeSchema } from "../../types/type";
import { Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const api_url = import.meta.env.VITE_API_URL;
const front_url = import.meta.env.VITE_FRONT_URL;

const zodFormSchema: ZodType<CodeSchema> = z.object({
  code: z
    .string()
    .min(5, { message: "Le code doit être d'au moins 6 caractères" }),
});

type emailProps = {
  email: string;
  setCode: (code: string) => void;
};

export const CodeConfirm = ({ email, setCode }: emailProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CodeSchema>({
    resolver: zodResolver(zodFormSchema),
    defaultValues: { code: "" },
  });

  // Effet pour gérer le timer
  useEffect(() => {
    let interval: number;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [countdown, isResendDisabled]);

  // Fonction pour renvoyer le code
  const handleResendCode = async () => {
    console.log(email);
    setIsResendDisabled(true);
    setCountdown(30);

    try {
      const response = await fetch(`${api_url}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Une erreur est survenue.");
      }
      const result = await response.json();
    } catch (error: any) {
      console.log(error);
       // Afficher l'erreur sous le bouton
    }
  };

  const handleSubmitForm = async (data: CodeSchema) => {
    setServerError(null); // Réinitialiser l'erreur à chaque tentative
    
    // Afficher le code saisi dans la console
    console.log("Code saisi:", data.code);

    try {
      const response = await fetch(
        `${api_url}/auth/reset-password-code-confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: data.code,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Une erreur est survenue.");
      }

      const result = await response.json();
      // Mettre à jour le code dans le contexte parent pour passer à l'étape suivante
      setCode(data.code);
    } catch (error: any) {
      setServerError(error.message); // Afficher l'erreur sous le bouton
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

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <fieldset disabled={isSubmitting} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 text-center"
              >
                Renseignez le code reçu sur votre adresse email
              </label>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <button
                type="button"
                disabled={isResendDisabled}
                onClick={handleResendCode}
                className={`flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                  isResendDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-300"
                    : "bg-red-700 text-white hover:bg-red-800 focus:ring-red-700 active:bg-red-900"
                }`}
              >
                {isResendDisabled
                  ? `Renvoyer le code dans ${countdown}s`
                  : "Renvoyer le code"}
              </button>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin m-auto" />
                ) : (
                  "Valider"
                )}
              </button>
            </div>

            {/* Affichage du message d'erreur si le code échoue */}
            {serverError && (
              <p className="text-red-500 text-center text-sm font-semibold bg-rose-100 h-12 m-4 rounded-lg flex items-center justify-center">
                Le code ne correspond pas
              </p>
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
};
