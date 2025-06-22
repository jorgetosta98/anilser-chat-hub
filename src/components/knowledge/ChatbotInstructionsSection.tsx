
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bot, Save, Settings } from "lucide-react";

interface ChatbotInstruction {
  id: string;
  persona_name: string;
  persona_description: string;
  instructions: string;
  additional_context: string;
  is_active: boolean;
}

export function ChatbotInstructionsSection() {
  const [instruction, setInstruction] = useState<ChatbotInstruction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    persona_name: "SafeBoy",
    persona_description: "",
    instructions: "",
    additional_context: "",
    is_active: true
  });

  useEffect(() => {
    if (user) {
      fetchInstructions();
    }
  }, [user]);

  const fetchInstructions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chatbot_instructions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setInstruction(data);
        setFormData({
          persona_name: data.persona_name || "SafeBoy",
          persona_description: data.persona_description || "",
          instructions: data.instructions || "",
          additional_context: data.additional_context || "",
          is_active: data.is_active
        });
      }
    } catch (error) {
      console.error('Erro ao buscar instruções:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as instruções do chatbot.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      if (instruction) {
        // Atualizar instrução existente
        const { error } = await supabase
          .from('chatbot_instructions')
          .update({
            persona_name: formData.persona_name,
            persona_description: formData.persona_description,
            instructions: formData.instructions,
            additional_context: formData.additional_context,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', instruction.id);

        if (error) throw error;
      } else {
        // Criar nova instrução
        const { error } = await supabase
          .from('chatbot_instructions')
          .insert({
            user_id: user.id,
            persona_name: formData.persona_name,
            persona_description: formData.persona_description,
            instructions: formData.instructions,
            additional_context: formData.additional_context,
            is_active: formData.is_active
          });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Instruções do chatbot salvas com sucesso!",
      });

      await fetchInstructions();
    } catch (error) {
      console.error('Erro ao salvar instruções:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as instruções do chatbot.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Configurações do Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Configurações do Chatbot
        </CardTitle>
        <CardDescription>
          Personalize como seu assistente virtual deve se comportar e responder às perguntas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="persona_name">Nome do Assistente</Label>
              <Input
                id="persona_name"
                value={formData.persona_name}
                onChange={(e) => handleInputChange('persona_name', e.target.value)}
                placeholder="Ex: SafeBoy, MeuAssistente..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active" className="flex items-center gap-2">
                Status
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <span className="text-sm text-gray-600">
                  {formData.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona_description">Descrição da Personalidade</Label>
            <Textarea
              id="persona_description"
              value={formData.persona_description}
              onChange={(e) => handleInputChange('persona_description', e.target.value)}
              placeholder="Descreva como seu assistente deve se apresentar e qual sua personalidade..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instruções Principais</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              placeholder="Defina as instruções principais sobre como o chatbot deve responder, que tipo de linguagem usar, etc..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_context">Contexto Adicional</Label>
            <Textarea
              id="additional_context"
              value={formData.additional_context}
              onChange={(e) => handleInputChange('additional_context', e.target.value)}
              placeholder="Informações específicas sobre sua empresa, políticas, procedimentos que o chatbot deve conhecer..."
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
