
import { useState } from 'react';
import { WhatsAppConnection } from '@/types/whatsapp';
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppDatabase } from './useWhatsAppDatabase';
import { generateQRCode, checkConnectionStatus } from '@/services/whatsappService';
import { getErrorMessage, createCountdownTimer } from '@/utils/whatsappUtils';

export function useWhatsAppConnections() {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const { toast } = useToast();
  
  const { 
    fetchConnections: dbFetchConnections,
    createConnection: dbCreateConnection,
    updateConnection: dbUpdateConnection,
    deleteConnection: dbDeleteConnection 
  } = useWhatsAppDatabase();

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const data = await dbFetchConnections();
      setConnections(data);
    } finally {
      setIsLoading(false);
    }
  };

  const createConnection = async (connectionData: Omit<WhatsAppConnection, 'id'>) => {
    setIsLoading(true);
    try {
      console.log('Criando conexão com dados:', connectionData);
      
      // Gerar QR code primeiro
      const qrCodeData = await generateQRCode(connectionData.instance_name, connectionData.whatsapp_number);
      console.log('QR Code gerado com sucesso');
      setQrCode(qrCodeData);

      // Salvar conexão no banco de dados
      const data = await dbCreateConnection(connectionData);
      if (!data) throw new Error('Falha ao criar conexão no banco de dados');

      toast({
        title: "QR Code Gerado",
        description: "Escaneie o QR code com seu WhatsApp para conectar",
      });

      // Iniciar countdown para verificar status
      setCountdown(30);
      
      const cleanup = createCountdownTimer(
        30,
        (timeLeft) => setCountdown(timeLeft),
        async () => {
          try {
            const statusResult = await checkConnectionStatus(connectionData.instance_name);
            console.log('Status verificado:', statusResult);
            
            // Atualizar status na base de dados
            await dbUpdateConnection(data.id!, { status: 'connected' });
              
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
      );

      await fetchConnections();
      return data;
    } catch (error) {
      console.error('Error creating WhatsApp connection:', error);
      
      const errorMessage = getErrorMessage(error) || "Erro ao gerar QR code do WhatsApp";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConnection = async (id: string, updates: Partial<WhatsAppConnection>) => {
    const result = await dbUpdateConnection(id, updates);
    if (result) {
      await fetchConnections();
    }
    return result;
  };

  const deleteConnection = async (id: string) => {
    const success = await dbDeleteConnection(id);
    if (success) {
      await fetchConnections();
    }
    return success;
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
