
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Building } from 'lucide-react';

interface AuthSignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function AuthSignupForm({ isLoading, setIsLoading }: AuthSignupFormProps) {
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '',
    company: ''
  });
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: 'Erro no cadastro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: 'Erro no cadastro',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        signupForm.email, 
        signupForm.password, 
        signupForm.fullName,
        'client',
        signupForm.company
      );
      
      if (error) {
        toast({
          title: 'Erro no cadastro',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Cadastro realizado com sucesso!',
          description: 'Redirecionando para o dashboard...',
        });
        
        // Redirecionar para o dashboard após cadastro
        setTimeout(() => {
          navigate('/chat');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Criar nova conta</CardTitle>
        <CardDescription>
          Preencha os dados para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="signup-name">Nome completo</Label>
            <Input
              id="signup-name"
              type="text"
              required
              value={signupForm.fullName}
              onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              required
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
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
                value={signupForm.company}
                onChange={(e) => setSignupForm({ ...signupForm, company: e.target.value })}
                placeholder="Nome da sua empresa"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="signup-password">Senha</Label>
            <Input
              id="signup-password"
              type="password"
              required
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <div>
            <Label htmlFor="signup-confirm-password">Confirmar senha</Label>
            <Input
              id="signup-confirm-password"
              type="password"
              required
              value={signupForm.confirmPassword}
              onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            Cadastrar
          </Button>
        </form>
      </CardContent>
    </>
  );
}
