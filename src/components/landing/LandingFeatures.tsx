
import { Shield, MessageSquare, Clock, Award, Database, CheckCircle } from 'lucide-react';

export function LandingFeatures() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trabalhe de forma mais inteligente, não mais difícil
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            O Safeboy oferece todas as ferramentas que você precisa para manter 
            sua empresa segura e em conformidade com as normas de segurança.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-primary text-white rounded-2xl p-8">
            <div className="bg-white/20 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-6">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Chat Inteligente</h3>
            <p className="text-primary-100 mb-6">
              Converse naturalmente sobre suas dúvidas de segurança e receba 
              respostas detalhadas e precisas instantaneamente.
            </p>
            <button className="text-white font-semibold hover:text-primary-100 transition-colors">
              Saiba mais →
            </button>
          </div>
          
          <div className="bg-primary text-white rounded-2xl p-8">
            <div className="bg-white/20 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-6">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Base de Conhecimento</h3>
            <p className="text-primary-100 mb-6">
              Acesso a uma vasta base de dados com normas, regulamentações 
              e melhores práticas de segurança sempre atualizadas.
            </p>
            <button className="text-white font-semibold hover:text-primary-100 transition-colors">
              Saiba mais →
            </button>
          </div>
          
          <div className="bg-primary text-white rounded-2xl p-8">
            <div className="bg-white/20 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-6">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Relatórios Personalizados</h3>
            <p className="text-primary-100 mb-6">
              Gere relatórios customizados sobre questões específicas de 
              segurança para sua empresa com apenas alguns cliques.
            </p>
            <button className="text-white font-semibold hover:text-primary-100 transition-colors">
              Saiba mais →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
