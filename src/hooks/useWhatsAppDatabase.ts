
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppConnection } from '@/types/whatsapp';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useWhatsAppDatabase() {
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConnections = async (): Promise<WhatsAppConnection[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching WhatsApp connections:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conexões do WhatsApp",
        variant: "destructive",
      });
      return [];
    }
  };

  const createConnection = async (connectionData: Omit<WhatsAppConnection, 'id'>): Promise<WhatsAppConnection | null> => {
    if (!user) return null;

    try {
      console.log('Criando conexão com dados:', connectionData);

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
      return data;
    } catch (error) {
      console.error('Error creating WhatsApp connection:', error);
      throw error;
    }
  };

  const updateConnection = async (id: string, updates: Partial<WhatsAppConnection>): Promise<WhatsAppConnection | null> => {
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

  const deleteConnection = async (id: string): Promise<boolean> => {
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
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
  };
}
