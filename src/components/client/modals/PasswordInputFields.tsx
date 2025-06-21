
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputFieldsProps {
  formData: {
    newPassword: string;
    confirmPassword: string;
  };
  setFormData: (data: { newPassword: string; confirmPassword: string }) => void;
}

export function PasswordInputFields({ formData, setFormData }: PasswordInputFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="newPassword">Nova senha</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            placeholder="Digite sua nova senha"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            placeholder="Confirme sua nova senha"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-medium">A senha deve conter:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Pelo menos 6 caracteres</li>
          <li>Pelo menos uma letra maiúscula</li>
          <li>Pelo menos uma letra minúscula</li>
          <li>Pelo menos um número</li>
        </ul>
      </div>
    </div>
  );
}
