
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ChatbotInstruction } from '@/types/chatbotInstructions';

export function useChatbotInstructionFormValidation() {
  const { toast } = useToast();
  const { user } = useAuth();

  const validateForm = (formData: ChatbotInstruction): boolean => {
    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para salvar as configurações.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.persona_name.trim()) {
      toast({
        title: "Campo Obrigatório",
        description: "O nome do chatbot é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.persona_description.trim()) {
      toast({
        title: "Campo Obrigatório",
        description: "A descrição do chatbot é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    validateForm,
  };
}
