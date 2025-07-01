
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Star, Users, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">Safeboy</h1>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Assistente Inteligente de
            <span className="text-primary block">Segurança para Sua Empresa</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Especializado em normas e regulamentações de segurança, oferecendo 
            respostas precisas e atualizadas 24/7 para manter sua empresa segura e em conformidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => navigate('/auth')}
            >
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => navigate('/auth')}
            >
              Fazer Login
            </Button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left side - Chat Interface */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6 h-80">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Safeboy Assistant</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600">Como posso ajudar com questões de segurança hoje?</p>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-4 ml-8">
                      <p className="text-sm text-gray-700">Preciso de informações sobre NR-35</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600">A NR-35 estabelece os requisitos mínimos para trabalho em altura...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="space-y-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Consultas Hoje</p>
                      <p className="text-2xl font-bold text-primary">47</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tempo Resposta</p>
                      <p className="text-2xl font-bold text-green-600">2.3s</p>
                    </div>
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Precisão</p>
                      <p className="text-2xl font-bold text-blue-600">98%</p>
                    </div>
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">+98%</div>
            <div className="text-gray-600">Precisão nas Respostas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-600">Disponibilidade</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600">Normas Cadastradas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-gray-600">Empresas Atendidas</div>
          </div>
        </div>
      </div>
    </section>
  );
}
