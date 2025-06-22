
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatbotInstruction {
  id: string;
  user_id: string;
  instructions: string;
  persona_name: string;
  persona_description?: string;
  additional_context?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useChatbotInstructions() {
  const [instructions, setInstructions] = useState<ChatbotInstruction[]>([]);
  const [activeInstruction, setActiveInstruction] = useState<ChatbotInstruction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchInstructions = async () => {
    if (!user) {
      setInstructions([]);
      setActiveInstruction(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chatbot_instructions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInstructions(data || []);
      
      // Find the active instruction
      const active = data?.find(instruction => instruction.is_active);
      setActiveInstruction(active || null);
    } catch (error) {
      console.error('Error fetching chatbot instructions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as instruções do chatbot.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createInstruction = async (instructionData: Omit<ChatbotInstruction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar instruções.",
        variant: "destructive",
      });
      return null;
    }

    try {
      // If this instruction should be active, deactivate others
      if (instructionData.is_active) {
        await supabase
          .from('chatbot_instructions')
          .update({ is_active: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('chatbot_instructions')
        .insert([{
          ...instructionData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Instruções do chatbot criadas com sucesso.",
      });

      await fetchInstructions();
      return data;
    } catch (error) {
      console.error('Error creating chatbot instruction:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar as instruções do chatbot.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateInstruction = async (id: string, instructionData: Partial<Omit<ChatbotInstruction, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      // If this instruction should be active, deactivate others
      if (instructionData.is_active) {
        await supabase
          .from('chatbot_instructions')
          .update({ is_active: false })
          .eq('user_id', user?.id)
          .neq('id', id);
      }

      const { data, error } = await supabase
        .from('chatbot_instructions')
        .update(instructionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Instruções do chatbot atualizadas com sucesso.",
      });

      await fetchInstructions();
      return data;
    } catch (error) {
      console.error('Error updating chatbot instruction:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as instruções do chatbot.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteInstruction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chatbot_instructions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Instruções do chatbot removidas com sucesso.",
      });

      await fetchInstructions();
    } catch (error) {
      console.error('Error deleting chatbot instruction:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover as instruções do chatbot.",
        variant: "destructive",
      });
    }
  };

  const activateInstruction = async (id: string) => {
    await updateInstruction(id, { is_active: true });
  };

  useEffect(() => {
    fetchInstructions();
  }, [user]);

  return {
    instructions,
    activeInstruction,
    isLoading,
    fetchInstructions,
    createInstruction,
    updateInstruction,
    deleteInstruction,
    activateInstruction,
  };
}
