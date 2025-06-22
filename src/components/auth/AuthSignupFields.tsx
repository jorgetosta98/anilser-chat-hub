
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Eye, EyeOff } from 'lucide-react';

interface AuthSignupFieldsProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    company: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  onFormChange: (field: string, value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export function AuthSignupFields({
  formData,
  showPassword,
  showConfirmPassword,
  onFormChange,
  onTogglePassword,
  onToggleConfirmPassword,
}: AuthSignupFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="signup-name">Nome completo</Label>
        <Input
          id="signup-name"
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => onFormChange('fullName', e.target.value)}
          placeholder="Seu nome completo"
        />
      </div>

      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => onFormChange('email', e.target.value)}
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <Label htmlFor="signup-company">Empresa</Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="signup-company"
            type="text"
            value={formData.company}
            onChange={(e) => onFormChange('company', e.target.value)}
            placeholder="Nome da sua empresa"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="signup-password">Senha</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) => onFormChange('password', e.target.value)}
            placeholder="••••••••"
            className="pr-10"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="signup-confirm-password">Confirmar senha</Label>
        <div className="relative">
          <Input
            id="signup-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={(e) => onFormChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            className="pr-10"
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
