
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LoginActionsProps {
  onLogin: () => void;
  isLoading: boolean;
}

export function LoginActions({ onLogin, isLoading }: LoginActionsProps) {
  return (
    <>
      {/* Forgot password link */}
      <div className="text-center">
        <Link 
          to="/forgot-password" 
          className="text-sm text-teal-600 hover:underline"
        >
          Esqueci Minha Senha
        </Link>
      </div>

      <Button 
        className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base"
        onClick={onLogin}
        disabled={isLoading}
      >
        Entrar
      </Button>
    </>
  );
}
