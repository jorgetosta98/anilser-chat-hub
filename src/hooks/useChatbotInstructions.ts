
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useChatbotInstructionsValidation } from './useChatbotInstrucionsValidation';
import { ChatbotInstruction } from '@/types/chatbotInstructions';
import { ChatbotInstructionsService } from '@/services/chatbotInstructionsService';
import { getChatbotInstructionsErrorMessage } from '@/utils/chatbotInstructionsErrors';

export function useChatbotInstructions() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { validateInstructionData, sanitizeInstructionData } = useChatbotInstructionsValidation();

  const fetchInstructions = useCallback(async (): Promise<ChatbotInstruction | null> => {
    if (!user) {
      console.warn('Usuário não autenticado ao tentar buscar instruções');
      return null;
    }

    try {
      setIsLoading(true);
      return await ChatbotInstructionsService.fetchActiveInstructions(user.id);
    } catch (error) {
      console.error('Erro ao carregar instruções do chatbot:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações do chatbot.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const saveInstructions = useCallback(async (
    instructionData: Omit<ChatbotInstruction, 'id' | 'created_at' | 'updated_at'>,
    existingId?: string
  ): Promise<ChatbotInstruction | null> => {
    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para salvar as configurações.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsSaving(true);

      // Sanitizar e validar os dados
      const sanitizedData = sanitizeInstructionData({
        ...instructionData,
        user_id: user.id,
      });

      if (!validateInstructionData(sanitizedData)) {
        return null;
      }

      const result = await ChatbotInstructionsService.saveInstructions(sanitizedData, existingId);

      toast({
        title: "Configurações Salvas",
        description: existingId 
          ? "As configurações do chatbot foram atualizadas com sucesso!" 
          : "As configurações do chatbot foram criadas com sucesso!",
      });

      return result;
    } catch (error) {
      console.error('Erro ao salvar instruções do chatbot:', error);
      
      const errorMessage = getChatbotInstructionsErrorMessage(error);

      toast({
        title: "Erro ao Salvar",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user, toast, validateInstructionData, sanitizeInstructionData]);

  const deleteInstructions = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para remover configurações.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      await ChatbotInstructionsService.deleteInstructions(id, user.id);

      toast({
        title: "Configuração Removida",
        description: "A configuração do chatbot foi removida com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Erro ao remover instruções:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a configuração.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    fetchInstructions,
    saveInstructions,
    deleteInstructions,
    isLoading,
    isSaving,
  };
}
