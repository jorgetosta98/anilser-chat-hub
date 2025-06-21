
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AILoading } from "@/components/ui/ai-loading";
import { PageTransition } from "@/components/ui/page-transition";
import { useToast } from "@/hooks/use-toast";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
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

  // Se está carregando, mostrar o loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <AILoading message="Fazendo login..." />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-sm space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 rounded-full mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Safeboy</h1>
            </div>

            {/* Welcome */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Boas vindas!</h2>
              <p className="text-gray-600 mb-8">Insira seus dados de acesso:</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="seuemail@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-12 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

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
                onClick={handleLogin}
                disabled={isLoading}
              >
                Entrar
              </Button>

              <div className="text-center text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-teal-600 hover:underline">
                  Cadastre-se aqui.
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div 
          className="hidden lg:block lg:flex-1 bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(rgba(13, 148, 136, 0.7), rgba(13, 148, 136, 0.7)), url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3')`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Segurança Inteligente</h2>
              <p className="text-lg opacity-90">
                Seu assistente especializado em normas e regulamentações de segurança
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
