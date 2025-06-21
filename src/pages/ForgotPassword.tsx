
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/ui/page-transition";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      setIsSubmitted(true);
      
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

  if (isSubmitted) {
    return (
      <PageTransition>
        <div className="min-h-screen flex">
          {/* Left side - Success message */}
          <div className="flex-1 flex items-center justify-center p-8 bg-white">
            <div className="w-full max-w-sm space-y-8">
              {/* Logo */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Safeboy</h1>
              </div>

              {/* Success message */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">E-mail enviado!</h2>
                <p className="text-gray-600 mb-4">
                  Enviamos um link para redefinir sua senha para:
                </p>
                <p className="font-semibold text-gray-900 mb-6">{email}</p>
                <p className="text-sm text-gray-500 mb-8">
                  Verifique sua caixa de entrada e spam. O link expira em 24 horas.
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white h-12"
                  onClick={() => window.location.href = '/login'}
                >
                  Voltar ao login
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                >
                  Enviar novamente
                </Button>
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
                <h2 className="text-3xl font-bold mb-4">Recuperação de Conta</h2>
                <p className="text-lg opacity-90">
                  Em breve você receberá as instruções para redefinir sua senha
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Safeboy</h1>
            </div>

            {/* Welcome */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h2>
              <p className="text-gray-600 mb-8">
                Digite seu e-mail e enviaremos um link para redefinir sua senha
              </p>
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
              <h2 className="text-3xl font-bold mb-4">Recuperação Segura</h2>
              <p className="text-lg opacity-90">
                Enviaremos instruções seguras para recuperar o acesso à sua conta
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
