
import { Star, Quote } from 'lucide-react';

export function LandingTestimonials() {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Gerente de Segurança",
      company: "Indústria ABC",
      content: "O Safeboy revolucionou nossa gestão de segurança. Agora temos acesso instantâneo a todas as normas e conseguimos responder rapidamente a qualquer dúvida da equipe.",
      rating: 5,
      avatar: "MS"
    },
    {
      name: "João Santos",
      role: "Coordenador de SST",
      company: "Construtora XYZ",
      content: "Incrível como o Safeboy consegue fornecer respostas precisas sobre NRs e outras regulamentações. Economizamos horas de pesquisa todos os dias.",
      rating: 5,
      avatar: "JS"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Junte-se a mais de 1000+ clientes satisfeitos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja o que nossos clientes dizem sobre o Safeboy e como ele transformou 
            a gestão de segurança em suas empresas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 relative">
              <Quote className="h-8 w-8 text-primary mb-4" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                  <div className="text-primary font-medium">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
