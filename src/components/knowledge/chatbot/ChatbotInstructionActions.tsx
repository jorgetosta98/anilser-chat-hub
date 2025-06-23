
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ChatbotInstructionActionsProps {
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  hasExistingConfig: boolean;
  user: any;
}

export function ChatbotInstructionActions({ 
  onSave, 
  onReset, 
  isSaving, 
  hasExistingConfig, 
  user 
}: ChatbotInstructionActionsProps) {
  return (
    <div className="flex gap-3 pt-4 border-t">
      <Button 
        onClick={onSave} 
        disabled={isSaving || !user}
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <Save className="w-4 h-4" />
        )}
        {isSaving ? 'Salvando...' : (hasExistingConfig ? 'Atualizar' : 'Salvar')}
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline"
        disabled={isSaving || !user}
      >
        Resetar
      </Button>
    </div>
  );
}
