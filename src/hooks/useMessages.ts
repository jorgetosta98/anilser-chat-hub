
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;

export function useMessages(conversationId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId && !!user,
  });

  const addMessageMutation = useMutation({
    mutationFn: async ({ content, isUser }: { content: string; isUser: boolean }) => {
      if (!conversationId) throw new Error('No conversation selected');
      
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          content,
          is_user: isUser,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      // Update conversation's updated_at timestamp
      if (conversationId) {
        supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          });
      }
    },
  });

  return {
    messages: messages || [],
    isLoading,
    addMessage: addMessageMutation.mutate,
    isAddingMessage: addMessageMutation.isPending,
  };
}
