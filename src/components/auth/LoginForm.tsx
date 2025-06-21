
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  const navigate = useNavigate();
  const { toast } = useToast();

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
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros nos campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular processo de login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Salvar preferência de lembrar senha se selecionado
      if (formData.rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
        localStorage.setItem('savedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('savedEmail');
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando...",
      });
      
      navigate('/chat');
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar email salvo se existir
  useState(() => {
    const rememberLogin = localStorage.getItem('rememberLogin');
    const savedEmail = localStorage.getItem('savedEmail');
    
    if (rememberLogin === 'true' && savedEmail) {
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
