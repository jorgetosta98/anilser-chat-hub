
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface AuthLoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function AuthLoginForm({ isLoading, setIsLoading }: AuthLoginFormProps) {
  const [loginForm, setLoginForm] = useState({ 
    email: '', 
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  // Carregar dados salvos quando o componente monta
  useState(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMe && savedEmail) {
      setLoginForm(prev => ({
        ...prev,
        email: savedEmail,
        password: savedPassword || '',
        rememberMe: true
      }));
    }
  });

  const validateForm = () => {
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: '🤖 Ops! Alguns campos estão vazios',
        description: 'Para continuar, por favor preencha seu email e senha. Estou aqui para ajudar!',
        variant: 'destructive',
        className: 'border-red-200 bg-red-50 text-red-800',
      });
      return false;
    }
    
    if (!loginForm.email.includes('@')) {
      toast({
        title: '📧 Email inválido',
        description: 'Parece que o formato do email não está correto. Que tal verificar e tentar novamente?',
        variant: 'destructive',
        className: 'border-orange-200 bg-orange-50 text-orange-800',
      });
      return false;
    }
    
    if (loginForm.password.length < 6) {
      toast({
        title: '🔑 Senha muito curta',
        description: 'A senha precisa ter pelo menos 6 caracteres. Pode verificar se digitou corretamente?',
        variant: 'destructive',
        className: 'border-yellow-200 bg-yellow-50 text-yellow-800',
      });
      return false;
    }
    
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário ANTES de qualquer loading
    if (!validateForm()) {
      return; // Para aqui se a validação falhar, SEM mostrar loading
    }
    
    // Só ativar loading APÓS validação passar
    setIsLoading(true);

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        // Parar loading imediatamente quando há erro de autenticação
        setIsLoading(false);
        
        toast({
          title: '🔐 Acesso não autorizado',
          description: 'Parece que a senha ou email estão incorretos. Que tal tentar novamente? Se precisar de ajuda, estou por aqui!',
          variant: 'destructive',
          className: 'border-orange-200 bg-orange-50 text-orange-800',
        });
        return;
      }

      // Salvar dados se "Lembrar de mim" estiver marcado
      if (loginForm.rememberMe) {
        localStorage.setItem('rememberedEmail', loginForm.email);
        localStorage.setItem('rememberedPassword', loginForm.password);
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('keepLoggedIn', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('keepLoggedIn');
      }

      // Login bem-sucedido - mostrar mensagem de sucesso
      toast({
        title: '🎉 Login realizado com sucesso!',
        description: 'Bem-vindo de volta! Redirecionando...',
        className: 'border-teal-200 bg-teal-50 text-teal-800',
      });

      // O redirecionamento será feito automaticamente pelo useAuthRedirect
      
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      setIsLoading(false);
      toast({
        title: '⚠️ Algo deu errado',
        description: 'Ocorreu um erro inesperado. Não se preocupe, vamos tentar resolver! Tente novamente em alguns instantes.',
        variant: 'destructive',
        className: 'border-red-200 bg-red-50 text-red-800',
      });
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
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="login-password">Senha</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={loginForm.rememberMe}
              onCheckedChange={(checked) => 
                setLoginForm({ ...loginForm, rememberMe: checked as boolean })
              }
              disabled={isLoading}
            />
            <Label htmlFor="remember-me" className="text-sm text-gray-700 cursor-pointer">
              Lembrar de mim e manter conectado
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </>
  );
}
