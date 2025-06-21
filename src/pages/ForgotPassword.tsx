
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Success message */}
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

            {/* Success message */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">E-mail enviado!</h1>
              <p className="text-gray-600 mb-6">
                Enviamos um link para redefinir sua senha para <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Verifique sua caixa de entrada e spam. O link expira em 24 horas.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                onClick={() => window.location.href = '/login'}
              >
                Voltar ao login
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setIsSubmitted(false)}
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
    );
  }

  return (
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h1>
            <p className="text-gray-600">
              Digite seu e-mail e enviaremos um link para redefinir sua senha
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="seuemail@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                onClick={handleSubmit}
                disabled={!email}
              >
                Enviar link de recuperação
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
            <h2 className="text-3xl font-bold mb-4">Recuperação Segura</h2>
            <p className="text-lg opacity-90">
              Enviaremos instruções seguras para recuperar o acesso à sua conta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
