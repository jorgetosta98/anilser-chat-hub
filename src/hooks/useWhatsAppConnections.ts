
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
  const [qrCode, setQrCode] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
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

  const generateQRCode = async (instanceName: string, whatsappNumber: string): Promise<string> => {
    try {
      const response = await fetch('https://webhookn8n.vivendodemicrosaas.com.br/webhook/038b58f0-f085-47b5-98c7-cde82fd14391', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instance_name: instanceName,
          whatsapp_number: whatsappNumber
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const checkConnectionStatus = async (): Promise<string> => {
    try {
      const response = await fetch('https://webhookn8n.vivendodemicrosaas.com.br/webhook/ec5f7a5f-0255-4c76-9397-df81ac442058', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check connection status');
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error('Error checking connection status:', error);
      throw error;
    }
  };

  const createConnection = async (connectionData: Omit<WhatsAppConnection, 'id'>) => {
    if (!user) return null;

    setIsLoading(true);
    try {
      // Generate QR code first
      const qrCodeData = await generateQRCode(connectionData.instance_name, connectionData.whatsapp_number);
      setQrCode(qrCodeData);

      // Start countdown
      let timeLeft = 30;
      setCountdown(timeLeft);
      
      const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          // Check connection status after countdown
          checkConnectionStatus().then((statusImage) => {
            setQrCode(statusImage);
            toast({
              title: "Status Atualizado",
              description: "Verifique o novo QR code ou status da conexão",
            });
          }).catch((error) => {
            console.error('Error updating status:', error);
            toast({
              title: "Erro",
              description: "Erro ao verificar status da conexão",
              variant: "destructive",
            });
          });
        }
      }, 1000);

      // Save connection to database
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .insert({
          user_id: user.id,
          instance_name: connectionData.instance_name,
          whatsapp_number: connectionData.whatsapp_number,
          status: 'pending' as const
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "QR Code Gerado",
        description: "Escaneie o QR code com seu WhatsApp para conectar",
      });

      await fetchConnections();
      return data;
    } catch (error) {
      console.error('Error creating WhatsApp connection:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar QR code do WhatsApp",
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

  const clearQRCode = () => {
    setQrCode('');
    setCountdown(0);
  };

  return {
    connections,
    isLoading,
    qrCode,
    countdown,
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
    clearQRCode,
  };
}
