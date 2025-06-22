
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useAuthSignupForm() {
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateFormField = (field: string, value: string) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSignUp = async (e: React.FormEvent, setIsLoading: (loading: boolean) => void) => {
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
      console.log('Dados do cadastro AuthSignupForm:', signupForm);
      
      const { error } = await signUp(
        signupForm.email, 
        signupForm.password, 
        signupForm.fullName,
        'client',
        signupForm.company || ''
      );
      
      if (error) {
        console.error('Erro no signUp:', error);
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
        
        setTimeout(() => {
          navigate('/chat');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
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

  return {
    signupForm,
    showPassword,
    showConfirmPassword,
    updateFormField,
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleSignUp,
  };
}
