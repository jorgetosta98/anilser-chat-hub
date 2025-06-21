
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();

  const validateEmail = (email: string): string => {
    if (!email) return "E-mail é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "E-mail inválido";
    return "";
  };

  const handleSubmit = async () => {
    const error = validateEmail(email);
    setEmailError(error);
    
    if (error) {
      toast({
        title: "Erro de validação",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess(email);
      
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar e-mail",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="email"
            placeholder="seuemail@email.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
          />
        </div>
        {emailError && (
          <p className="text-sm text-red-500">{emailError}</p>
        )}
      </div>

      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-white h-12"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar link de recuperação"}
      </Button>

      <div className="text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
