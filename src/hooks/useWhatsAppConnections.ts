import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppConnection {
  id?: string;
  instance_name: string;
  whatsapp_number: string;
  status?: string | null;
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
      console.log('Gerando QR Code para:', { instanceName, whatsappNumber });
      
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

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Verificar o tipo de conteúdo da resposta
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (contentType?.includes('image/')) {
        // Se for uma imagem, converter para base64
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return `data:${contentType};base64,${base64}`;
      } else {
        // Se for JSON ou texto, tentar parsear
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        try {
          const jsonData = JSON.parse(responseText);
          if (jsonData.qr_code) {
            return jsonData.qr_code;
          } else if (jsonData.image) {
            return jsonData.image;
          }
        } catch (parseError) {
          console.error('Erro ao fazer parse do JSON:', parseError);
        }
        
        throw new Error('Resposta do webhook não contém QR code válido');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const checkConnectionStatus = async (instanceName: string): Promise<string> => {
    try {
      console.log('Verificando status da conexão para:', instanceName);
      
      const response = await fetch('https://webhookn8n.vivendodemicrosaas.com.br/webhook/ec5f7a5f-0255-4c76-9397-df81ac442058', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instance_name: instanceName
        })
      });

      console.log('Status check response:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('image/')) {
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return `data:${contentType};base64,${base64}`;
      } else {
        const responseText = await response.text();
        console.log('Status response text:', responseText);
        
        try {
          const jsonData = JSON.parse(responseText);
          return jsonData.status || 'unknown';
        } catch {
          return responseText;
        }
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      throw error;
    }
  };

  const createConnection = async (connectionData: Omit<WhatsAppConnection, 'id'>) => {
    if (!user) return null;

    setIsLoading(true);
    try {
      console.log('Criando conexão com dados:', connectionData);
      
      // Gerar QR code primeiro
      const qrCodeData = await generateQRCode(connectionData.instance_name, connectionData.whatsapp_number);
      console.log('QR Code gerado com sucesso');
      setQrCode(qrCodeData);

      // Salvar conexão no banco de dados
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
        title: "QR Code Gerado",
        description: "Escaneie o QR code com seu WhatsApp para conectar",
      });

      // Iniciar countdown para verificar status
      let timeLeft = 30;
      setCountdown(timeLeft);
      
      const countdownInterval = setInterval(async () => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          try {
            const statusResult = await checkConnectionStatus(connectionData.instance_name);
            console.log('Status verificado:', statusResult);
            
            // Atualizar status na base de dados
            await supabase
              .from('whatsapp_connections')
              .update({ status: 'connected' })
              .eq('id', data.id);
              
            toast({
              title: "Status Atualizado",
              description: "Conexão verificada com sucesso",
            });
            
            await fetchConnections();
          } catch (error) {
            console.error('Erro ao verificar status:', error);
            toast({
              title: "Erro",
              description: "Erro ao verificar status da conexão",
              variant: "destructive",
            });
          }
        }
      }, 1000);

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
