
import { Brain, Sparkles } from 'lucide-react';

interface AILoadingProps {
  message?: string;
  className?: string;
}

export function AILoading({ message = "Processando...", className = "" }: AILoadingProps) {
  return (
    <div 
      className={`fixed inset-0 w-full h-full flex flex-col items-center justify-center space-y-6 ${className}`}
      style={{ backgroundColor: '#0D9488' }}
    >
      {/* Container do ícone com animação */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Círculo de fundo pulsante */}
        <div 
          className="w-20 h-20 rounded-full animate-pulse absolute"
          style={{ backgroundColor: 'rgba(249, 250, 251, 0.2)' }}
        />
        
        {/* Ícone do cérebro centralizado */}
        <Brain 
          className="w-10 h-10 animate-bounce z-10" 
          style={{ color: '#F9FAFB' }}
        />
        
        {/* Partículas animadas ao redor - posicionamento melhorado */}
        <div className="absolute top-0 right-0">
          <Sparkles 
            className="w-4 h-4 animate-spin" 
            style={{ color: '#F9FAFB' }} 
          />
        </div>
        <div className="absolute bottom-0 left-0">
          <Sparkles 
            className="w-4 h-4 animate-spin" 
            style={{ color: '#F9FAFB', animationDelay: '0.5s' }} 
          />
        </div>
        <div className="absolute top-0 left-0">
          <Sparkles 
            className="w-3 h-3 animate-ping" 
            style={{ color: '#F9FAFB', animationDelay: '1s' }} 
          />
        </div>
        <div className="absolute bottom-0 right-0">
          <Sparkles 
            className="w-3 h-3 animate-pulse" 
            style={{ color: '#F9FAFB', animationDelay: '1.5s' }} 
          />
        </div>
      </div>
      
      {/* Texto do loading */}
      <div className="text-center space-y-3">
        <p className="text-xl font-medium" style={{ color: '#F9FAFB' }}>
          {message}
        </p>
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#F9FAFB', animationDelay: '0ms' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#F9FAFB', animationDelay: '150ms' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#F9FAFB', animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
