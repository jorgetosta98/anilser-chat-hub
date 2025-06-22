
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useChatbotInstructionsValidation } from './useChatbotInstrucionsValidation';

export interface ChatbotInstruction {
  id?: string;
  persona_name: string;
  persona_description: string;
  instructions: string;
  additional_context: string;
  is_active: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

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
      
      const { data, error } = await supabase
        .from('chatbot_instructions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar instruções:', error);
        throw error;
      }

      return data;
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

      let result;

      if (existingId) {
        // Atualizar instrução existente
        result = await supabase
          .from('chatbot_instructions')
          .update(sanitizedData)
          .eq('id', existingId)
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Desativar instruções anteriores
        await supabase
          .from('chatbot_instructions')
          .update({ is_active: false })
          .eq('user_id', user.id);

        // Criar nova instrução
        result = await supabase
          .from('chatbot_instructions')
          .insert(sanitizedData)
          .select()
          .single();
      }

      if (result.error) {
        console.error('Erro do Supabase ao salvar:', result.error);
        throw result.error;
      }

      toast({
        title: "Configurações Salvas",
        description: existingId 
          ? "As configurações do chatbot foram atualizadas com sucesso!" 
          : "As configurações do chatbot foram criadas com sucesso!",
      });

      return result.data;
    } catch (error) {
      console.error('Erro ao salvar instruções do chatbot:', error);
      
      let errorMessage = "Não foi possível salvar as configurações. Tente novamente.";
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = "Já existe uma configuração ativa. Tente atualizar a configuração existente.";
        } else if (error.message.includes('permission')) {
          errorMessage = "Você não tem permissão para salvar essas configurações.";
        } else if (error.message.includes('validation')) {
          errorMessage = "Dados inválidos. Verifique os campos obrigatórios.";
        }
      }

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

      const { error } = await supabase
        .from('chatbot_instructions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

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
