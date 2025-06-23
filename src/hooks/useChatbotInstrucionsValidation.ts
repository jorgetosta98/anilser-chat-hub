
import { useToast } from '@/hooks/use-toast';

interface ChatbotInstructionData {
  persona_name: string;
  persona_description: string;
  instructions: string;
  additional_context: string;
  is_active: boolean;
  user_id: string;
}

export function useChatbotInstructionsValidation() {
  const { toast } = useToast();

  const validateInstructionData = (data: ChatbotInstructionData): boolean => {
    // Validar user_id
    if (!data.user_id || data.user_id.trim() === '') {
      toast({
        title: "Erro de Validação",
        description: "ID de usuário é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    // Validar persona_name (nome do chatbot)
    if (!data.persona_name || data.persona_name.trim() === '') {
      toast({
        title: "Campo Obrigatório",
        description: "O nome do chatbot é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (data.persona_name.trim().length < 2) {
      toast({
        title: "Erro de Validação",
        description: "O nome do chatbot deve ter pelo menos 2 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    if (data.persona_name.trim().length > 100) {
      toast({
        title: "Erro de Validação",
        description: "O nome do chatbot deve ter no máximo 100 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    // Validar persona_description (descrição do chatbot)
    if (!data.persona_description || data.persona_description.trim() === '') {
      toast({
        title: "Campo Obrigatório",
        description: "A descrição do chatbot é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    if (data.persona_description.trim().length < 10) {
      toast({
        title: "Erro de Validação",
        description: "A descrição do chatbot deve ter pelo menos 10 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    if (data.persona_description.trim().length > 500) {
      toast({
        title: "Erro de Validação",
        description: "A descrição do chatbot deve ter no máximo 500 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    // Validar instruções (opcional, mas se fornecida deve ter tamanho mínimo)
    if (data.instructions && data.instructions.trim().length > 0) {
      if (data.instructions.trim().length < 10) {
        toast({
          title: "Erro de Validação",
          description: "As instruções devem ter pelo menos 10 caracteres se fornecidas.",
          variant: "destructive",
        });
        return false;
      }

      if (data.instructions.trim().length > 2000) {
        toast({
          title: "Erro de Validação",
          description: "As instruções devem ter no máximo 2000 caracteres.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const sanitizeInstructionData = (data: ChatbotInstructionData): ChatbotInstructionData => {
    return {
      persona_name: data.persona_name.trim(),
      persona_description: data.persona_description.trim(),
      instructions: data.instructions ? data.instructions.trim() : '',
      additional_context: data.additional_context ? data.additional_context.trim() : '',
      is_active: Boolean(data.is_active),
      user_id: data.user_id.trim(),
    };
  };

  return {
    validateInstructionData,
    sanitizeInstructionData,
  };
}
