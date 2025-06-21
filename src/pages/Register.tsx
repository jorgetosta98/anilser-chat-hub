
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, Lock, Eye, EyeOff, User, Building } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AILoading } from "@/components/ui/ai-loading";
import { PageTransition } from "@/components/ui/page-transition";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        'client',
        formData.company
      );

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        
        // Redirecionar para o dashboard após cadastro
        setTimeout(() => {
          navigate('/chat');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  // Se está carregando, mostrar o loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <AILoading message="Criando sua conta..." />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Safeboy</span>
              </div>
            </div>

            {/* Welcome */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar conta</h1>
              <p className="text-gray-600">Preencha os dados para se cadastrar:</p>
            </div>

            {/* Form */}
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nome completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="seuemail@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Empresa</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Nome da sua empresa"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={isLoading}
                  >
                    Criar conta
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Faça login aqui.
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
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
              <h2 className="text-3xl font-bold mb-4">Junte-se à Segurança Inteligente</h2>
              <p className="text-lg opacity-90">
                Crie sua conta e tenha acesso completo ao seu assistente especializado em normas e regulamentações
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
