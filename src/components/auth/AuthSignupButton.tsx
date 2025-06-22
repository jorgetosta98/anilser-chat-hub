
import { Button } from '@/components/ui/button';

interface AuthSignupButtonProps {
  isLoading: boolean;
  onClick: (e: React.FormEvent) => void;
}

export function AuthSignupButton({ isLoading, onClick }: AuthSignupButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading} onClick={onClick}>
      {isLoading ? 'Cadastrando...' : 'Cadastrar'}
    </Button>
  );
}
