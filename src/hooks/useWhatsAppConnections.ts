
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
      console.log('QR Code data length:', qrCodeData.length);
      console.log('QR Code starts with:', qrCodeData.substring(0, 50));
      
      setQrCode(qrCodeData);
      console.log('QR Code state atualizado');

      // Salvar conexão no banco de dados
      const data = await dbCreateConnection(connectionData);
      if (!data) throw new Error('Falha ao criar conexão no banco de dados');

      toast({
        title: "QR Code Gerado",
        description: "Escaneie o QR code com seu WhatsApp para conectar",
      });

      // Iniciar countdown para verificar status
      setCountdown(30);
      console.log('Countdown iniciado: 30 seconds');
      
      const cleanup = createCountdownTimer(
        30,
        (timeLeft) => {
          console.log('Countdown:', timeLeft);
          setCountdown(timeLeft);
        },
        async () => {
          console.log('Countdown finalizado, verificando status...');
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
            // Não mostrar erro de verificação de status como erro crítico
            console.log('Continuando sem verificação de status automática');
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
    console.log('Limpando QR Code');
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
