
import { supabase } from '@/integrations/supabase/client';
import { ChatbotInstruction } from '@/types/chatbotInstructions';

export class ChatbotInstructionsService {
  static async fetchActiveInstructions(userId: string): Promise<ChatbotInstruction | null> {
    const { data, error } = await supabase
      .from('chatbot_instructions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar instruções:', error);
      throw error;
    }

    return data;
  }

  static async saveInstructions(
    instructionData: Omit<ChatbotInstruction, 'id' | 'created_at' | 'updated_at'>,
    existingId?: string
  ): Promise<ChatbotInstruction> {
    let result;

    if (existingId) {
      // Atualizar instrução existente
      result = await supabase
        .from('chatbot_instructions')
        .update(instructionData)
        .eq('id', existingId)
        .eq('user_id', instructionData.user_id)
        .select()
        .single();
    } else {
      // Desativar instruções anteriores
      await supabase
        .from('chatbot_instructions')
        .update({ is_active: false })
        .eq('user_id', instructionData.user_id);

      // Criar nova instrução
      result = await supabase
        .from('chatbot_instructions')
        .insert(instructionData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Erro do Supabase ao salvar:', result.error);
      throw result.error;
    }

    return result.data;
  }

  static async deleteInstructions(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('chatbot_instructions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  }
}
