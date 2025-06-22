
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function useAuthLoginForm() {
  const [loginForm, setLoginForm] = useState<LoginFormData>({ 
    email: '', 
    password: '',
    rememberMe: false
  });
  const { signIn } = useAuth();
  const { toast } = useToast();

  // Load saved data when component mounts
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

  const handleSignIn = async (e: React.FormEvent, setIsLoading: (loading: boolean) => void) => {
    e.preventDefault();
    
    // Validate form BEFORE any loading
    if (!validateForm()) {
      return; // Stop here if validation fails, WITHOUT showing loading
    }
    
    // Only activate loading AFTER validation passes
    setIsLoading(true);

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        // Stop loading immediately when there's authentication error
        setIsLoading(false);
        
        toast({
          title: '🔐 Acesso não autorizado',
          description: 'Parece que a senha ou email estão incorretos. Que tal tentar novamente? Se precisar de ajuda, estou por aqui!',
          variant: 'destructive',
          className: 'border-orange-200 bg-orange-50 text-orange-800',
        });
        return;
      }

      // Save data if "Remember me" is checked
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

      // Successful login - show success message
      toast({
        title: '🎉 Login realizado com sucesso!',
        description: 'Bem-vindo de volta! Redirecionando...',
        className: 'border-teal-200 bg-teal-50 text-teal-800',
      });

      // Redirect will be done automatically by useAuthRedirect
      
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

  const updateLoginForm = (field: keyof LoginFormData, value: string | boolean) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    loginForm,
    updateLoginForm,
    handleSignIn,
  };
}
