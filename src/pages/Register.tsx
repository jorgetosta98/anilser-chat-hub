
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AILoading } from "@/components/ui/ai-loading";
import { PageTransition } from "@/components/ui/page-transition";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterBackground } from "@/components/auth/RegisterBackground";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    company: string;
  }) => {
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
          <RegisterForm onSubmit={handleRegister} />
        </div>

        {/* Right side - Image */}
        <RegisterBackground />
      </div>
    </PageTransition>
  );
}
