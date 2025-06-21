
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Boas vindas!</h1>
            <p className="text-gray-600">Insira seus dados de acesso:</p>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Esqueci Minha Senha
                  </Link>
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary-700 text-white"
                onClick={() => window.location.href = '/'}
              >
                Entrar
              </Button>

              <div className="text-center text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Cadastre-se aqui.
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
            <h2 className="text-3xl font-bold mb-4">Segurança Inteligente</h2>
            <p className="text-lg opacity-90">
              Seu assistente especializado em normas e regulamentações de segurança
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
