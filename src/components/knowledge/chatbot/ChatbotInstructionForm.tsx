
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { ChatbotInstruction } from '@/types/chatbotInstructions';
import { useAuth } from '@/contexts/AuthContext';

interface ChatbotInstructionFormProps {
  formData: ChatbotInstruction;
  onInputChange: (field: keyof ChatbotInstruction, value: string | boolean) => void;
  user: any;
}

export function ChatbotInstructionForm({ formData, onInputChange, user }: ChatbotInstructionFormProps) {
  const { profile } = useAuth();
  
  // Pegar o nome da empresa para mostrar dica
  const companyName = profile?.company || user?.user_metadata?.company;

  return (
    <>
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium">Autenticação Necessária</p>
            <p className="text-yellow-700 text-sm">Você precisa estar logado para configurar o chatbot.</p>
          </div>
        </div>
      )}

      {/* Dica sobre nome da empresa */}
      {user && companyName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-blue-800 font-medium">Dica Personalizada</p>
            <p className="text-blue-700 text-sm">
              Detectamos que sua empresa é <strong>{companyName}</strong>. 
              Considere usar nomes como "Assistente {companyName}" ou "{companyName} Bot" para maior personalização.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="persona_name">Nome do Chatbot *</Label>
            <Input
              id="persona_name"
              value={formData.persona_name}
              onChange={(e) => onInputChange('persona_name', e.target.value)}
              placeholder={companyName ? `Ex: Assistente ${companyName}` : "Digite o nome do seu chatbot..."}
              disabled={!user}
            />
            <p className="text-sm text-gray-500 mt-1">
              Este será o nome que aparecerá nas conversas com os usuários.
            </p>
          </div>

          <div>
            <Label htmlFor="persona_description">Descrição do Chatbot *</Label>
            <Textarea
              id="persona_description"
              value={formData.persona_description}
              onChange={(e) => onInputChange('persona_description', e.target.value)}
              placeholder={companyName ? `Ex: Assistente virtual da ${companyName}, especializado em...` : "Descreva brevemente quem é seu assistente virtual..."}
              className="h-24"
              disabled={!user}
            />
            <p className="text-sm text-gray-500 mt-1">
              Uma breve descrição sobre a personalidade e função do seu chatbot.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => onInputChange('is_active', checked)}
              disabled={!user}
            />
            <Label htmlFor="is_active">Configuração Ativa</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="instructions">Instruções Personalizadas</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => onInputChange('instructions', e.target.value)}
              placeholder="Instruções específicas sobre como o chatbot deve se comportar..."
              className="h-40"
              disabled={!user}
            />
            <p className="text-sm text-gray-500 mt-1">
              O chatbot já terá acesso ao conhecimento da sua base de dados automaticamente.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
