
import { Shield, Zap, Users, Award, Database, CheckCircle } from 'lucide-react';

export function LandingIntegrations() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Escale, adapte-se e inove
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            O Safeboy cresce com sua empresa, oferecendo soluções escaláveis 
            para equipes de todos os tamanhos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Integration card */}
          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6">Integra-se com suas ferramentas</h3>
            <p className="text-gray-600 mb-8">
              Conecte o Safeboy com as ferramentas que sua equipe já usa diariamente.
            </p>
            
            {/* Integration icons */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <Database className="h-8 w-8 text-pink-600" />
              </div>
            </div>
          </div>

          {/* Right side - Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">API Robusta</h4>
                <p className="text-primary-100">
                  Integre facilmente com sistemas existentes através da nossa API completa.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Sincronização em Tempo Real</h4>
                <p className="text-primary-100">
                  Dados sempre atualizados e sincronizados em todas as plataformas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Colaboração em Equipe</h4>
                <p className="text-primary-100">
                  Compartilhe conhecimento e colabore com toda a equipe de segurança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
