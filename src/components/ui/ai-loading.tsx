
import { Brain, Sparkles } from 'lucide-react';

interface AILoadingProps {
  message?: string;
  className?: string;
}

export function AILoading({ message = "Processando...", className = "" }: AILoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Container do ícone com animação */}
      <div className="relative">
        {/* Círculo de fundo pulsante */}
        <div 
          className="w-16 h-16 rounded-full animate-pulse"
          style={{ backgroundColor: '#0D9488' }}
        />
        
        {/* Ícone do cérebro */}
        <Brain 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-bounce" 
        />
        
        {/* Partículas animadas ao redor */}
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-4 h-4 animate-spin" style={{ color: '#0D9488' }} />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Sparkles className="w-4 h-4 animate-spin" style={{ color: '#0D9488', animationDelay: '0.5s' }} />
        </div>
        <div className="absolute -top-2 -left-2">
          <Sparkles className="w-3 h-3 animate-ping" style={{ color: '#0D9488', animationDelay: '1s' }} />
        </div>
      </div>
      
      {/* Texto do loading */}
      <div className="text-center">
        <p className="text-lg font-medium" style={{ color: '#0D9488' }}>
          {message}
        </p>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#0D9488', animationDelay: '0ms' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#0D9488', animationDelay: '150ms' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#0D9488', animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
