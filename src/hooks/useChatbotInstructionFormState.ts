
import { useState } from 'react';
import { ChatbotInstruction } from '@/types/chatbotInstructions';

export function useChatbotInstructionFormState() {
  const [formData, setFormData] = useState<ChatbotInstruction>({
    persona_name: '',
    persona_description: '',
    instructions: '',
    additional_context: '',
    is_active: true,
    user_id: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingConfig, setHasExistingConfig] = useState(false);

  const updateFormData = (updates: Partial<ChatbotInstruction>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const resetFormData = (data: ChatbotInstruction) => {
    setFormData(data);
  };

  return {
    formData,
    isLoading,
    isSaving,
    hasExistingConfig,
    setIsLoading,
    setIsSaving,
    setHasExistingConfig,
    updateFormData,
    resetFormData,
  };
}
