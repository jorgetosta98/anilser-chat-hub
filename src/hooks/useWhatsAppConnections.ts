
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppConnection {
  id?: string;
  instance_name: string;
  whatsapp_number: string;
  status?: 'pending' | 'connected' | 'disconnected' | 'error';
  connection_data?: any;
  created_at?: string;
  updated_at?: string;
}

export function useWhatsAppConnections() {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConnections = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching WhatsApp connections:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conexões do WhatsApp",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createConnection = async (connectionData: Omit<WhatsAppConnection, 'id'>) => {
    if (!user) return null;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .insert({
          user_id: user.id,
          instance_name: connectionData.instance_name,
          whatsapp_number: connectionData.whatsapp_number,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conexão WhatsApp criada com sucesso!",
      });

      await fetchConnections();
      return data;
    } catch (error) {
      console.error('Error creating WhatsApp connection:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar conexão do WhatsApp",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConnection = async (id: string, updates: Partial<WhatsAppConnection>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      await fetchConnections();
      return data;
    } catch (error) {
      console.error('Error updating WhatsApp connection:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar conexão do WhatsApp",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteConnection = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('whatsapp_connections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conexão removida com sucesso!",
      });

      await fetchConnections();
      return true;
    } catch (error) {
      console.error('Error deleting WhatsApp connection:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover conexão do WhatsApp",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    connections,
    isLoading,
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
  };
}
