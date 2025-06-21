
import { Shield } from "lucide-react";

export function ForgotPasswordHeader() {
  return (
    <>
      {/* Logo */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Safeboy</h1>
      </div>

      {/* Welcome */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h2>
        <p className="text-gray-600 mb-8">
          Digite seu e-mail e enviaremos um link para redefinir sua senha
        </p>
      </div>
    </>
  );
}
