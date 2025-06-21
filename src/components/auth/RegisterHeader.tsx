
import { Shield } from "lucide-react";

export function RegisterHeader() {
  return (
    <>
      {/* Logo */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 rounded-full mb-4">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Safeboy</h1>
      </div>

      {/* Welcome */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar conta</h2>
        <p className="text-gray-600 mb-8">Preencha os dados para se cadastrar:</p>
      </div>
    </>
  );
}
