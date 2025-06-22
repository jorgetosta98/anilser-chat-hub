
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AuthRememberMeProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}

export function AuthRememberMe({ checked, onChange, disabled }: AuthRememberMeProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember-me"
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
        disabled={disabled}
      />
      <Label htmlFor="remember-me" className="text-sm text-gray-700 cursor-pointer">
        Lembrar de mim e manter conectado
      </Label>
    </div>
  );
}
