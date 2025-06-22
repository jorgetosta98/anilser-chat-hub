
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppConnection {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  instance_id: string;
  status: string;
  qr_code?: string;
  webhook_url?: string;
  created_at: string;
  updated_at: string;
  connected_at?: string;
  last_seen?: string;
}

export function useWhatsAppConnections() {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching connections:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar conexões WhatsApp',
          variant: 'destructive'
        });
        return;
      }

      setConnections(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectConnection = async (instanceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
        body: {
          action: 'disconnect',
          connectionData: { instanceId }
        }
      });

      if (error) {
        console.error('Error disconnecting:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao desconectar WhatsApp',
          variant: 'destructive'
        });
        return;
      }

      if (data?.success) {
        toast({
          title: 'Sucesso',
          description: 'WhatsApp desconectado com sucesso'
        });
        fetchConnections(); // Refresh the list
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteConnection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_connections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting connection:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao excluir conexão',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Conexão excluída com sucesso'
      });
      fetchConnections(); // Refresh the list
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchConnections();

    // Set up real-time subscription
    const subscription = supabase
      .channel('whatsapp_connections')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'whatsapp_connections' 
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchConnections(); // Refresh when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    connections,
    loading,
    disconnectConnection,
    deleteConnection,
    refreshConnections: fetchConnections
  };
}
