
import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface ChatbotInstructionStatusProps {
  hasExistingConfig: boolean;
}

export function ChatbotInstructionStatus({ hasExistingConfig }: ChatbotInstructionStatusProps) {
  if (!hasExistingConfig) return null;

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-green-700">
          <Brain className="w-5 h-5" />
          <span className="font-medium">Status: Configuração Ativa</span>
        </div>
        <p className="text-green-600 text-sm mt-1">
          Seu chatbot está usando as configurações personalizadas. As mudanças são aplicadas imediatamente após salvar.
        </p>
      </CardContent>
    </Card>
  );
}
