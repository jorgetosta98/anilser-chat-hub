
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AuthEmailInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function AuthEmailInput({ value, onChange, disabled }: AuthEmailInputProps) {
  return (
    <div>
      <Label htmlFor="login-email">Email</Label>
      <Input
        id="login-email"
        type="email"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="seu@email.com"
        disabled={disabled}
      />
    </div>
  );
}
