
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-primary py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Pronto para transformar sua gestão de segurança?
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          Junte-se a centenas de profissionais que já confiam no Safeboy para suas necessidades de segurança.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4"
            onClick={() => navigate('/auth')}
          >
            Começar Gratuitamente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
