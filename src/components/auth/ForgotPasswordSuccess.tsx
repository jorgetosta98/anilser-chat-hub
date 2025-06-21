
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";

interface ForgotPasswordSuccessProps {
  email: string;
  onSendAgain: () => void;
}

export function ForgotPasswordSuccess({ email, onSendAgain }: ForgotPasswordSuccessProps) {
  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Safeboy</h1>
      </div>

      {/* Success message */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">E-mail enviado!</h2>
        <p className="text-gray-600 mb-4">
          Enviamos um link para redefinir sua senha para:
        </p>
        <p className="font-semibold text-gray-900 mb-6">{email}</p>
        <p className="text-sm text-gray-500 mb-8">
          Verifique sua caixa de entrada e spam. O link expira em 24 horas.
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white h-12"
          onClick={() => window.location.href = '/login'}
        >
          Voltar ao login
        </Button>
        
        <Button 
          variant="outline"
          className="w-full h-12"
          onClick={onSendAgain}
        >
          Enviar novamente
        </Button>
      </div>
    </div>
  );
}
