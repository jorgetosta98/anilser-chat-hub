import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ChatbotInstruction } from '@/types/chatbotInstructions';

export function useChatbotInstructionForm() {
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
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, user_id: user.id }));
      fetchExistingInstructions();
    }
  }, [user]);

  const fetchExistingInstructions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chatbot_instructions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setFormData({
          id: data.id,
          persona_name: data.persona_name || '',
          persona_description: data.persona_description || '',
          instructions: data.instructions || '',
          additional_context: data.additional_context || '',
          is_active: data.is_active,
          user_id: data.user_id,
        });
        setHasExistingConfig(true);
      } else {
        // Se não há configuração existente, sugerir nome da empresa como padrão
        const suggestedName = getSuggestedChatbotName();
        setFormData(prev => ({
          ...prev,
          persona_name: suggestedName,
          persona_description: suggestedName ? `Assistente virtual da ${suggestedName}` : '',
        }));
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

  const getSuggestedChatbotName = (): string => {
    // Pegar o nome da empresa do perfil ou dos metadados do usuário
    const companyName = profile?.company || user?.user_metadata?.company;
    
    if (companyName) {
      // Se há nome da empresa, usar como "Assistente [Nome da Empresa]"
      return `Assistente ${companyName}`;
    }
    
    // Caso contrário, usar nome genérico
    return 'Assistente Virtual';
  };

  const handleInputChange = (field: keyof ChatbotInstruction, value: string | boolean) => {
    if (!user) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
      user_id: user.id,
    }));
  };

  const validateForm = (): boolean => {
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

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      const dataToSave = {
        persona_name: formData.persona_name.trim(),
        persona_description: formData.persona_description.trim(),
        instructions: formData.instructions.trim(),
        additional_context: formData.additional_context.trim(),
        is_active: formData.is_active,
        user_id: user!.id,
      };

      let result;

      if (hasExistingConfig && formData.id) {
        // Atualizar configuração existente
        result = await supabase
          .from('chatbot_instructions')
          .update(dataToSave)
          .eq('id', formData.id)
          .eq('user_id', user!.id)
          .select()
          .single();
      } else {
        // Criar nova configuração
        result = await supabase
          .from('chatbot_instructions')
          .insert(dataToSave)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Atualizar o estado local com os dados salvos
      if (result.data) {
        setFormData(prev => ({
          ...prev,
          id: result.data.id,
        }));
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
      const suggestedName = getSuggestedChatbotName();
      setFormData({
        persona_name: suggestedName,
        persona_description: suggestedName ? `Assistente virtual da ${suggestedName.replace('Assistente ', '')}` : '',
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
