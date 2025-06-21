
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
    onSuccess: async (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      
      // If this is the first user message, update the conversation title
      if (newMessage.is_user && conversationId) {
        const currentMessages = messages || [];
        const userMessages = currentMessages.filter(msg => msg.is_user);
        
        // If this is the first user message, update conversation title
        if (userMessages.length === 0) {
          const truncatedTitle = newMessage.content.length > 50 
            ? newMessage.content.substring(0, 50) + '...'
            : newMessage.content;
            
          await supabase
            .from('conversations')
            .update({ 
              title: truncatedTitle,
              updated_at: new Date().toISOString() 
            })
            .eq('id', conversationId);
            
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        } else {
          // Just update the timestamp for existing conversations
          await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);
            
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
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
