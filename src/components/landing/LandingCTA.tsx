
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-primary py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Shield className="h-16 w-16 text-white" />
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-6">
          A Melhor Solução Gratuita de Segurança para Sua Empresa
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          Comece hoje mesmo e transforme a gestão de segurança da sua empresa 
          com o poder da inteligência artificial especializada.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4"
            onClick={() => navigate('/auth')}
          >
            Começar Gratuitamente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
            onClick={() => navigate('/auth')}
          >
            Agendar Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-white mb-1">99.9%</div>
            <div className="text-primary-100 text-sm">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">24/7</div>
            <div className="text-primary-100 text-sm">Suporte</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">ISO</div>
            <div className="text-primary-100 text-sm">Certificado</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">GDPR</div>
            <div className="text-primary-100 text-sm">Compliant</div>
          </div>
        </div>
      </div>
    </section>
  );
}
