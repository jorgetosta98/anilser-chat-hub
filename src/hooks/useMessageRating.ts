
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserFrequentQuestions } from './useUserFrequentQuestions';
import { useToast } from './use-toast';

export function useMessageRating() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { addFrequentQuestion } = useUserFrequentQuestions();
  const { toast } = useToast();

  const submitRating = async (
    conversationId: string,
    messageContent: string,
    rating: number,
    feedback?: string
  ) => {
    if (!user || !conversationId) return;

    setIsSubmitting(true);
    try {
      // Salvar avaliação da conversa
      const { error: ratingError } = await supabase
        .from('conversation_ratings')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          rating,
          feedback: feedback || null,
        });

      if (ratingError) throw ratingError;

      // Se a avaliação for positiva (4 ou 5), adicionar à lista de perguntas frequentes
      if (rating >= 4 && messageContent) {
        // Extrair a pergunta do usuário (primeira mensagem que não é do assistente)
        const userQuestion = extractUserQuestion(messageContent);
        
        if (userQuestion) {
          await addFrequentQuestion(
            userQuestion,
            conversationId,
            rating,
            true // is_positive
          );
        }
      }

      toast({
        title: "Avaliação enviada",
        description: "Obrigado pelo seu feedback! Isso nos ajuda a melhorar.",
      });

    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a avaliação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para extrair a pergunta do usuário do conteúdo da mensagem
  const extractUserQuestion = (messageContent: string): string | null => {
    // Se o conteúdo já parece ser uma pergunta direta, retornar
    if (messageContent.includes('?')) {
      // Pegar a primeira frase que termina com ?
      const sentences = messageContent.split(/[.!?]/);
      const question = sentences.find(s => s.trim().endsWith('?') || s.includes('?'));
      return question ? question.trim() + '?' : messageContent.substring(0, 200);
    }
    
    // Caso contrário, pegar os primeiros 200 caracteres
    return messageContent.length > 200 
      ? messageContent.substring(0, 200) + '...'
      : messageContent;
  };

  return {
    submitRating,
    isSubmitting,
  };
}
