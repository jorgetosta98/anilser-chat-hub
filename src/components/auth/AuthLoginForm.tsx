
import { CardContent } from '@/components/ui/card';
import { AuthLoginHeader } from './AuthLoginHeader';
import { AuthEmailInput } from './AuthEmailInput';
import { AuthPasswordInput } from './AuthPasswordInput';
import { AuthRememberMe } from './AuthRememberMe';
import { AuthLoginButton } from './AuthLoginButton';
import { useAuthLoginForm } from '@/hooks/useAuthLoginForm';

interface AuthLoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function AuthLoginForm({ isLoading, setIsLoading }: AuthLoginFormProps) {
  const { loginForm, updateLoginForm, handleSignIn } = useAuthLoginForm();

  return (
    <>
      <AuthLoginHeader />
      <CardContent>
        <form onSubmit={(e) => handleSignIn(e, setIsLoading)} className="space-y-4">
          <AuthEmailInput
            value={loginForm.email}
            onChange={(value) => updateLoginForm('email', value)}
            disabled={isLoading}
          />
          
          <AuthPasswordInput
            value={loginForm.password}
            onChange={(value) => updateLoginForm('password', value)}
            disabled={isLoading}
          />
          
          <AuthRememberMe
            checked={loginForm.rememberMe}
            onChange={(checked) => updateLoginForm('rememberMe', checked)}
            disabled={isLoading}
          />

          <AuthLoginButton
            onClick={(e) => handleSignIn(e, setIsLoading)}
            disabled={isLoading}
          />
        </form>
      </CardContent>
    </>
  );
}
