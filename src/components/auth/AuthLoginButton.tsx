
import { Button } from '@/components/ui/button';

interface AuthLoginButtonProps {
  onClick: (e: React.FormEvent) => void;
  disabled: boolean;
}

export function AuthLoginButton({ onClick, disabled }: AuthLoginButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={disabled} onClick={onClick}>
      {disabled ? 'Entrando...' : 'Entrar'}
    </Button>
  );
}
