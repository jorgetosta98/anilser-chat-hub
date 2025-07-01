
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Básico",
      price: "Grátis",
      description: "Perfeito para começar",
      features: [
        "100 consultas por mês",
        "Acesso às normas básicas",
        "Suporte por email",
        "Relatórios simples"
      ],
      color: "bg-gray-50",
      buttonVariant: "outline" as const
    },
    {
      name: "Profissional",
      price: "R$ 97",
      description: "Para equipes de segurança",
      features: [
        "Consultas ilimitadas",
        "Todas as normas e regulamentações",
        "Suporte prioritário",
        "Relatórios avançados",
        "Integração com sistemas",
        "API completa"
      ],
      color: "bg-primary text-white",
      buttonVariant: "secondary" as const,
      popular: true
    },
    {
      name: "Empresarial",
      price: "R$ 197",
      description: "Para grandes organizações",
      features: [
        "Tudo do Profissional",
        "Suporte dedicado",
        "Treinamentos personalizados",
        "Consultoria especializada",
        "SLA garantido",
        "Implantação assistida"
      ],
      color: "bg-gray-50",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Preços transparentes para todos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para sua empresa. Todos os planos incluem acesso 
            completo às funcionalidades básicas do Safeboy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`rounded-2xl p-8 relative ${plan.color}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className={`text-xl font-semibold mb-2 ${plan.color.includes('primary') ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-bold mb-2 ${plan.color.includes('primary') ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                  {plan.price !== "Grátis" && <span className="text-lg font-normal">/mês</span>}
                </div>
                <p className={`${plan.color.includes('primary') ? 'text-primary-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.color.includes('primary') ? 'text-white' : 'text-primary'}`} />
                    <span className={`${plan.color.includes('primary') ? 'text-primary-100' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.buttonVariant}
                className="w-full"
                size="lg"
                onClick={() => navigate('/auth')}
              >
                {plan.price === "Grátis" ? "Começar Grátis" : "Escolher Plano"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
