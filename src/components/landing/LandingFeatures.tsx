
import { CheckCircle, FileText, MessageSquare, Database, Clock, Award } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat Inteligente",
      description: "Converse naturalmente sobre suas dúvidas de segurança e receba respostas detalhadas e precisas."
    },
    {
      icon: Database,
      title: "Base de Conhecimento",
      description: "Acesso a uma vasta base de dados com normas, regulamentações e melhores práticas de segurança."
    },
    {
      icon: FileText,
      title: "Relatórios Personalizados",
      description: "Gere relatórios customizados sobre questões específicas de segurança para sua empresa."
    },
    {
      icon: Clock,
      title: "Disponível 24/7",
      description: "Acesso completo a qualquer hora do dia, sem limitações ou horários de funcionamento."
    },
    {
      icon: Award,
      title: "Sempre Atualizado",
      description: "Informações constantemente atualizadas com as últimas normas e regulamentações."
    },
    {
      icon: CheckCircle,
      title: "Fácil de Usar",
      description: "Interface intuitiva que torna a consulta de informações de segurança simples e eficiente."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Por que escolher o Safeboy?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desenvolvido especificamente para profissionais de segurança, oferecemos as ferramentas 
            que você precisa para manter sua empresa segura e em conformidade.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
