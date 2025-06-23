
import { supabase } from '@/integrations/supabase/client';
import { ChatbotInstruction } from '@/types/chatbotInstructions';

export class ChatbotInstructionFormService {
  static async fetchExistingInstructions(userId: string): Promise<ChatbotInstruction | null> {
    const { data, error } = await supabase
      .from('chatbot_instructions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    if (data) {
      return {
        id: data.id,
        persona_name: data.persona_name || '',
        persona_description: data.persona_description || '',
        instructions: data.instructions || '',
        additional_context: data.additional_context || '',
        is_active: data.is_active,
        user_id: data.user_id,
      };
    }

    return null;
  }

  static async saveInstructions(
    formData: ChatbotInstruction,
    hasExistingConfig: boolean,
    userId: string
  ): Promise<any> {
    const dataToSave = {
      persona_name: formData.persona_name.trim(),
      persona_description: formData.persona_description.trim(),
      instructions: formData.instructions.trim(),
      additional_context: formData.additional_context.trim(),
      is_active: formData.is_active,
      user_id: userId,
    };

    if (hasExistingConfig && formData.id) {
      // Atualizar configuração existente
      return await supabase
        .from('chatbot_instructions')
        .update(dataToSave)
        .eq('id', formData.id)
        .eq('user_id', userId)
        .select()
        .single();
    } else {
      // Criar nova configuração
      return await supabase
        .from('chatbot_instructions')
        .insert(dataToSave)
        .select()
        .single();
    }
  }
}
