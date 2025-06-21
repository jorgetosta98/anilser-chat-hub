
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserFrequentQuestion {
  id: string;
  user_id: string;
  question: string;  
  conversation_id?: string;
  rating?: number;
  is_positive: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserFrequentQuestions() {
  const [questions, setQuestions] = useState<UserFrequentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchPositiveQuestions = async () => {
    if (!user) {
      setQuestions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching positive questions for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_frequent_questions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_positive', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching positive questions:', error);
        throw error;
      }
      
      console.log('Fetched positive questions:', data);
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching user frequent questions:', error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addFrequentQuestion = async (
    question: string,
    conversationId?: string,
    rating?: number,
    isPositive: boolean = false
  ) => {
    if (!user) {
      console.error('No user found when trying to add frequent question');
      return null;
    }

    try {
      console.log('Adding frequent question:', { question, conversationId, rating, isPositive, userId: user.id });
      
      // Verificar se a pergunta já existe para este usuário
      const { data: existingQuestion, error: checkError } = await supabase
        .from('user_frequent_questions')
        .select('id')
        .eq('user_id', user.id)
        .eq('question', question)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking existing question:', checkError);
        throw checkError;
      }

      // Se a pergunta já existe, apenas atualizar
      if (existingQuestion) {
        const { error: updateError } = await supabase
          .from('user_frequent_questions')
          .update({
            rating: rating || null,
            is_positive: isPositive,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingQuestion.id);

        if (updateError) {
          console.error('Error updating existing question:', updateError);
          throw updateError;
        }

        console.log('Updated existing question');
      } else {
        // Inserir nova pergunta
        const { data, error } = await supabase
          .from('user_frequent_questions')
          .insert([{
            user_id: user.id,
            question,
            conversation_id: conversationId || null,
            rating: rating || null,
            is_positive: isPositive,
          }])
          .select()
          .single();

        if (error) {
          console.error('Error inserting new question:', error);
          throw error;
        }

        console.log('Inserted new question:', data);
      }
      
      // Refresh the list if it's a positive question
      if (isPositive) {
        await fetchPositiveQuestions();
      }
      
      return true;
    } catch (error) {
      console.error('Error adding frequent question:', error);
      return null;
    }
  };

  const updateQuestionRating = async (
    questionId: string,
    rating: number,
    isPositive: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('user_frequent_questions')
        .update({
          rating,
          is_positive: isPositive,
        })
        .eq('id', questionId);

      if (error) throw error;
      
      // Refresh the list
      await fetchPositiveQuestions();
    } catch (error) {
      console.error('Error updating question rating:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPositiveQuestions();
    }
  }, [user]);

  return {
    questions,
    isLoading,
    fetchPositiveQuestions,
    addFrequentQuestion,
    updateQuestionRating,
  };
}
