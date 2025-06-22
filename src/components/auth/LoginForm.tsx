import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LoginHeader } from "./LoginHeader";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { RememberMeField } from "./RememberMeField";
import { LoginActions } from "./LoginActions";
import { LoginFooter } from "./LoginFooter";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "E-mail é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "E-mail inválido";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Senha é obrigatória";
    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    
    // Se houver erros, mostrar toast amigável sem loading
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "🤖 Ops! Alguns campos precisam de atenção",
        description: "Por favor, corrija os erros nos campos destacados. Estou aqui para ajudar!",
        variant: "destructive",
        className: "border-red-200 bg-red-50 text-red-800",
      });
      return false;
    }
    
    return true;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async () => {
    // Validar formulário ANTES de qualquer loading
    if (!validateForm()) {
      return; // Para aqui se a validação falhar, SEM mostrar loading
    }

    // Só ativar loading APÓS validação passar
    setIsLoading(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        // Parar loading imediatamente quando há erro de autenticação
        setIsLoading(false);
        
        toast({
          title: "🔐 Acesso não autorizado",
          description: "Parece que a senha ou email estão incorretos. Que tal tentar novamente? Se precisar de ajuda, estou por aqui!",
          variant: "destructive",
          className: "border-orange-200 bg-orange-50 text-orange-800",
        });
        return;
      }
      
      // Salvar preferência de lembrar senha se selecionado
      if (formData.rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
        localStorage.setItem('savedEmail', formData.email);
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('keepLoggedIn', 'true');
      } else {
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('keepLoggedIn');
      }
      
      toast({
        title: "🎉 Login realizado com sucesso!",
        description: "Bem-vindo de volta! Redirecionando...",
        className: "border-teal-200 bg-teal-50 text-teal-800",
      });
      
      // O redirecionamento será feito automaticamente pelo useAuthRedirect
      
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      toast({
        title: "⚠️ Algo deu errado",
        description: "Ocorreu um erro inesperado. Não se preocupe, vamos tentar resolver! Tente novamente em alguns instantes.",
        variant: "destructive",
        className: "border-red-200 bg-red-50 text-red-800",
      });
    }
  };

  // Carregar email salvo se existir
  useState(() => {
    const rememberLogin = localStorage.getItem('rememberLogin');
    const savedEmail = localStorage.getItem('savedEmail');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword'); 
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMe && rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        password: rememberedPassword || '',
        rememberMe: true
      }));
    } else if (rememberLogin === 'true' && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  });

  return (
    <div className="w-full max-w-sm space-y-8">
      <LoginHeader />

      {/* Form */}
      <div className="space-y-6">
        <EmailField 
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          error={errors.email}
        />

        <PasswordField 
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          error={errors.password}
        />

        <RememberMeField 
          checked={formData.rememberMe}
          onChange={(checked) => handleInputChange('rememberMe', checked)}
        />

        <LoginActions 
          onLogin={handleLogin}
          isLoading={isLoading}
        />

        <LoginFooter />
      </div>
    </div>
  );
}
