
import { User, Mail, Building, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
}

interface RegisterFieldsProps {
  formData: RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: string) => void;
}

export function RegisterFields({ formData, onChange }: RegisterFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Nome completo</label>
        <div className="relative">
          <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="pl-10 h-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="email"
            placeholder="seuemail@email.com"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="pl-10 h-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Empresa</label>
        <div className="relative">
          <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Nome da sua empresa"
            value={formData.company}
            onChange={(e) => onChange("company", e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            className="pl-10 pr-10 h-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••"
            value={formData.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            className="pl-10 pr-10 h-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
}
