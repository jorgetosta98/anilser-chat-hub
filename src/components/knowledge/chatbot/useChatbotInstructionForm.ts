
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ChatbotInstruction } from '@/types/chatbotInstructions';
import { useChatbotInstructionFormState } from '@/hooks/useChatbotInstructionFormState';
import { useChatbotInstructionFormValidation } from '@/hooks/useChatbotInstructionFormValidation';
import { useChatbotSuggestions } from '@/services/chatbotSuggestionsService';
import { ChatbotInstructionFormService } from '@/services/chatbotInstructionFormService';

export function useChatbotInstructionForm() {
  const {
    formData,
    isLoading,
    isSaving,
    hasExistingConfig,
    setIsLoading,
    setIsSaving,
    setHasExistingConfig,
    updateFormData,
    resetFormData,
  } = useChatbotInstructionFormState();

  const { validateForm } = useChatbotInstructionFormValidation();
  const { getSuggestedName, getSuggestedDescription } = useChatbotSuggestions();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      updateFormData({ user_id: user.id });
      fetchExistingInstructions();
    }
  }, [user]);

  const fetchExistingInstructions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const existingData = await ChatbotInstructionFormService.fetchExistingInstructions(user.id);

      if (existingData) {
        resetFormData(existingData);
        setHasExistingConfig(true);
      } else {
        // Se não há configuração existente, sugerir nome da empresa como padrão
        const suggestedName = getSuggestedName();
        const suggestedDescription = getSuggestedDescription();
        updateFormData({
          persona_name: suggestedName,
          persona_description: suggestedDescription,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar instruções:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações existentes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ChatbotInstruction, value: string | boolean) => {
    if (!user) return;
    
    updateFormData({
      [field]: value,
      user_id: user.id,
    });
  };

  const handleSave = async () => {
    if (!validateForm(formData)) return;

    try {
      setIsSaving(true);
      
      const result = await ChatbotInstructionFormService.saveInstructions(
        formData,
        hasExistingConfig,
        user!.id
      );

      if (result.error) {
        throw result.error;
      }

      // Atualizar o estado local com os dados salvos
      if (result.data) {
        updateFormData({ id: result.data.id });
        setHasExistingConfig(true);
      }

      toast({
        title: "Configurações Salvas",
        description: hasExistingConfig 
          ? "As configurações do chatbot foram atualizadas com sucesso!" 
          : "As configurações do chatbot foram criadas com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (hasExistingConfig) {
      fetchExistingInstructions();
    } else {
      const suggestedName = getSuggestedName();
      const suggestedDescription = getSuggestedDescription();
      resetFormData({
        persona_name: suggestedName,
        persona_description: suggestedDescription,
        instructions: '',
        additional_context: '',
        is_active: true,
        user_id: user?.id || '',
      });
    }
    toast({
      title: "Formulário Resetado",
      description: "Os campos foram restaurados aos valores originais.",
    });
  };

  return {
    formData,
    isLoading,
    isSaving,
    hasExistingConfig,
    handleInputChange,
    handleSave,
    handleReset,
  };
}
