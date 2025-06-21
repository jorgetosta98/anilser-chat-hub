
import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { ForgotPasswordHeader } from "@/components/auth/ForgotPasswordHeader";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ForgotPasswordSuccess } from "@/components/auth/ForgotPasswordSuccess";
import { ForgotPasswordBackground } from "@/components/auth/ForgotPasswordBackground";

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSuccess = (email: string) => {
    setSubmittedEmail(email);
    setIsSubmitted(true);
  };

  const handleSendAgain = () => {
    setIsSubmitted(false);
    setSubmittedEmail("");
  };

  if (isSubmitted) {
    return (
      <PageTransition>
        <div className="min-h-screen flex">
          {/* Left side - Success message */}
          <div className="flex-1 flex items-center justify-center p-8 bg-white">
            <ForgotPasswordSuccess 
              email={submittedEmail} 
              onSendAgain={handleSendAgain}
            />
          </div>

          {/* Right side - Image */}
          <ForgotPasswordBackground 
            title="Recuperação de Conta"
            description="Em breve você receberá as instruções para redefinir sua senha"
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-sm space-y-8">
            <ForgotPasswordHeader />
            <ForgotPasswordForm onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Right side - Image */}
        <ForgotPasswordBackground 
          title="Recuperação Segura"
          description="Enviaremos instruções seguras para recuperar o acesso à sua conta"
        />
      </div>
    </PageTransition>
  );
}
