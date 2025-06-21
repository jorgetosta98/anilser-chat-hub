
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PasswordField({ value, onChange, error }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Senha</label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-10 pr-10 h-12 ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
