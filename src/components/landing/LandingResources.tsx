
import { FileText, Video, BookOpen, Users } from 'lucide-react';

export function LandingResources() {
  const resources = [
    {
      icon: BookOpen,
      title: "Central de Ajuda",
      description: "Guias completos e tutoriais para aproveitar ao máximo o Safeboy",
      image: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: Video,
      title: "Treinamentos",
      description: "Vídeos e webinars sobre segurança do trabalho e uso do sistema",
      image: "bg-blue-100", 
      iconColor: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Biblioteca de Normas",
      description: "Acesso completo a todas as NRs e regulamentações atualizadas",
      image: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Conecte-se com outros profissionais de segurança",
      image: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Todos os recursos que você precisa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Além do assistente inteligente, oferecemos uma gama completa de recursos 
            para apoiar sua jornada em segurança do trabalho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${resource.image} rounded-2xl p-6 mb-6 relative overflow-hidden`}>
                <div className="flex items-center justify-center h-32">
                  <resource.icon className={`h-16 w-16 ${resource.iconColor}`} />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/30 rounded-full"></div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {resource.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {resource.description}
              </p>
              <button className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Saiba mais →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
