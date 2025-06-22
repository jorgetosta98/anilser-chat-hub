
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthLoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function AuthLoginForm({ isLoading, setIsLoading }: AuthLoginFormProps) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [localLoading, setLocalLoading] = useState(false);
  const { signIn, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos. Tente novamente.',
          variant: 'destructive',
        });
        setLocalLoading(false);
        return;
      }

      // Login bem-sucedido - mostrar mensagem de sucesso
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando...',
      });

      // Ativar loading da página principal apenas APÓS sucesso
      setIsLoading(true);
      
      // Aguardar um pouco para o profile ser carregado
      setTimeout(() => {
        // Verificar role do usuário para redirecionamento
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/chat');
        }
      }, 1000);

    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast({
        title: 'Erro no login',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
      setLocalLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Entrar na sua conta</CardTitle>
        <CardDescription>
          Digite suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              placeholder="seu@email.com"
              disabled={localLoading}
            />
          </div>
          <div>
            <Label htmlFor="login-password">Senha</Label>
            <Input
              id="login-password"
              type="password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="••••••••"
              disabled={localLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={localLoading || isLoading}>
            {localLoading ? 'Verificando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </>
  );
}
