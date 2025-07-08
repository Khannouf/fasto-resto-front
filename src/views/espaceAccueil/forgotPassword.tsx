import { useEffect, useState } from "react";
import { SendCode } from "./sendCode";
import { CodeConfirm } from "./codeConfirm";
import { NewPassword } from "./newPassword";

export const ForgotPassword = () => {
  // État pour récupérer l’email remonté
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null); 

  useEffect(() => {
    console.log(email);
    
  
  }, [email])
  

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* On passe la callback */}
        {!email && (
          <SendCode onCodeSent={setEmail} />
        )}
        {email && (
          <CodeConfirm email={email} setCode={setCode}/>
        )}
        {email && code && (
          <NewPassword code={code} email={email}/>
        )}
      </div>
    </div>
  );
};
