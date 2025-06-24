
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppMessage, WhatsAppConversation } from '@/types/whatsappMessages';

export function useWhatsAppMessages() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async (connectionId: string, participantNumber?: string) => {
    if (!user) return [];

    setIsLoading(true);
    try {
      let query = supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('connection_id', connectionId)
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true });

      if (participantNumber) {
        query = query.or(`from_number.eq.${participantNumber},to_number.eq.${participantNumber}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const fetchedMessages = data as WhatsAppMessage[];
      setMessages(fetchedMessages);
      return fetchedMessages;
    } catch (error) {
      console.error('Error fetching WhatsApp messages:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens do WhatsApp",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async (connectionId: string) => {
    if (!user) return [];

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('connection_id', connectionId)
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      
      const fetchedConversations = data as WhatsAppConversation[];
      setConversations(fetchedConversations);
      return fetchedConversations;
    } catch (error) {
      console.error('Error fetching WhatsApp conversations:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conversas do WhatsApp",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessage = async (message: Omit<WhatsAppMessage, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert({
          ...message,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar ou criar conversa
      await updateConversation(message.connection_id, message);

      toast({
        title: "Sucesso",
        description: "Mensagem salva com sucesso!",
      });

      return data as WhatsAppMessage;
    } catch (error) {
      console.error('Error saving WhatsApp message:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar mensagem do WhatsApp",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateConversation = async (connectionId: string, message: Omit<WhatsAppMessage, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const participantNumber = message.is_from_me ? message.to_number : message.from_number;
      
      // Verificar se a conversa já existe
      const { data: existingConversation, error: fetchError } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('connection_id', connectionId)
        .eq('user_id', user.id)
        .eq('participant_number', participantNumber)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingConversation) {
        // Atualizar conversa existente
        const { error } = await supabase
          .from('whatsapp_conversations')
          .update({
            last_message_at: message.timestamp,
            unread_count: message.is_from_me ? existingConversation.unread_count : (existingConversation.unread_count || 0) + 1
          })
          .eq('id', existingConversation.id);

        if (error) throw error;
      } else {
        // Criar nova conversa
        const { error } = await supabase
          .from('whatsapp_conversations')
          .insert({
            connection_id: connectionId,
            user_id: user.id,
            participant_number: participantNumber,
            last_message_at: message.timestamp,
            unread_count: message.is_from_me ? 0 : 1
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating WhatsApp conversation:', error);
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('whatsapp_conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conversa marcada como lida!",
      });

      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      toast({
        title: "Erro",
        description: "Erro ao marcar conversa como lida",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('whatsapp_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Mensagem removida com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error deleting WhatsApp message:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover mensagem do WhatsApp",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    messages,
    conversations,
    isLoading,
    fetchMessages,
    fetchConversations,
    saveMessage,
    markAsRead,
    deleteMessage,
  };
}
