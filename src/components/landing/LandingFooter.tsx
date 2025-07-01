
import { Shield } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Safeboy</span>
            </div>
            <p className="text-gray-400 mb-4">
              Seu assistente especializado em normas e regulamentações de segurança.
              Desenvolvido pela Frotas Softwares para profissionais que valorizam a segurança.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Funcionalidades</li>
              <li>Planos</li>
              <li>Suporte</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Sobre</li>
              <li>Contato</li>
              <li>Privacidade</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Frotas Softwares. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
