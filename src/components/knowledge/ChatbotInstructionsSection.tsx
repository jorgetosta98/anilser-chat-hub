
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Save, Plus, AlertCircle } from 'lucide-react';

interface ChatbotInstruction {
  id?: string;
  persona_name: string;
  persona_description: string;
  instructions: string;
  additional_context: string;
  is_active: boolean;
  user_id: string;
}

export function ChatbotInstructionsSection() {
  const [formData, setFormData] = useState<ChatbotInstruction>({
    persona_name: 'SafeBoy',
    persona_description: 'Assistente virtual especializado em segurança do trabalho e saúde ocupacional',
    instructions: '',
    additional_context: '',
    is_active: true,
    user_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingConfig, setHasExistingConfig] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
          persona_name: data.persona_name || 'SafeBoy',
          persona_description: data.persona_description || 'Assistente virtual especializado em segurança do trabalho e saúde ocupacional',
          instructions: data.instructions || '',
          additional_context: data.additional_context || '',
          is_active: data.is_active,
          user_id: data.user_id,
        });
        setHasExistingConfig(true);
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
        description: "O nome da persona é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.persona_description.trim()) {
      toast({
        title: "Campo Obrigatório",
        description: "A descrição da persona é obrigatória.",
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
      setFormData({
        persona_name: 'SafeBoy',
        persona_description: 'Assistente virtual especializado em segurança do trabalho e saúde ocupacional',
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Configurações do Chatbot
          </CardTitle>
          <CardDescription>
            Personalize a personalidade e comportamento do seu assistente virtual.
            {hasExistingConfig && (
              <span className="text-green-600 font-medium ml-2">
                ✓ Configuração ativa encontrada
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Autenticação Necessária</p>
                <p className="text-yellow-700 text-sm">Você precisa estar logado para configurar o chatbot.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="persona_name">Nome da Persona *</Label>
                <Input
                  id="persona_name"
                  value={formData.persona_name}
                  onChange={(e) => handleInputChange('persona_name', e.target.value)}
                  placeholder="Ex: SafeBoy, AssistenteTech..."
                  disabled={!user}
                />
              </div>

              <div>
                <Label htmlFor="persona_description">Descrição da Persona *</Label>
                <Textarea
                  id="persona_description"
                  value={formData.persona_description}
                  onChange={(e) => handleInputChange('persona_description', e.target.value)}
                  placeholder="Descreva brevemente quem é seu assistente virtual..."
                  className="h-24"
                  disabled={!user}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  disabled={!user}
                />
                <Label htmlFor="is_active">Configuração Ativa</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="instructions">Instruções Personalizadas</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Instruções específicas sobre como o chatbot deve se comportar..."
                  className="h-32"
                  disabled={!user}
                />
              </div>

              <div>
                <Label htmlFor="additional_context">Contexto Adicional da Empresa</Label>
                <Textarea
                  id="additional_context"
                  value={formData.additional_context}
                  onChange={(e) => handleInputChange('additional_context', e.target.value)}
                  placeholder="Informações específicas sobre sua empresa que o chatbot deve conhecer..."
                  className="h-32"
                  disabled={!user}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !user}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Salvando...' : (hasExistingConfig ? 'Atualizar' : 'Salvar')}
            </Button>
            
            <Button 
              onClick={handleReset} 
              variant="outline"
              disabled={isSaving || !user}
            >
              Resetar
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasExistingConfig && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Status: Configuração Ativa</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              Seu chatbot está usando as configurações personalizadas. As mudanças são aplicadas imediatamente após salvar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
