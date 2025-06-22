
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeBaseType } from './useKnowledgeBase';

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResponse = async (
    message: string, 
    conversationHistory: any[] = [], 
    knowledgeBase: KnowledgeBaseType = 'normal'
  ) => {
    setIsGenerating(true);
    
    try {
      // Obter o token de autenticação do usuário atual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message,
          conversationHistory: conversationHistory.slice(-10), // Últimas 10 mensagens para contexto
          knowledgeBase
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) throw error;

      return data.response || data.fallbackResponse || "Desculpe, não consegui gerar uma resposta.";
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      return "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.";
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateResponse,
    isGenerating
  };
}
