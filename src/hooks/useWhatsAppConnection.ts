
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useWhatsAppConnection() {
  const [step, setStep] = useState(1);
  const [connectionName, setConnectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const { toast } = useToast();

  const resetState = () => {
    setStep(1);
    setConnectionName("");
    setQrCode("");
    setInstanceId("");
    setConnectionStatus("disconnected");
  };

  const handleStartConnection = async () => {
    if (!connectionName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da conexão é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Criando instância WhatsApp com nome:', connectionName);
      
      const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
        body: {
          action: 'create_instance',
          connectionData: {
            name: connectionName,
            phone: ''
          }
        }
      });

      if (error) {
        console.error('Erro ao criar instância:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar conexão WhatsApp",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        console.log('Instância criada com sucesso:', data.instanceId);
        setInstanceId(data.instanceId);
        setStep(2);
        
        setTimeout(async () => {
          await getQRCode(data.instanceId);
        }, 2000);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar conexão",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getQRCode = async (instanceId: string) => {
    try {
      console.log('Buscando QR code para instância:', instanceId);
      
      const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
        body: {
          action: 'get_qr_code',
          connectionData: { instanceId }
        }
      });

      if (error) {
        console.error('Erro ao buscar QR code:', error);
        toast({
          title: "Erro",
          description: "Erro ao gerar QR code",
          variant: "destructive"
        });
        return;
      }

      if (data?.success && data.qrCode) {
        console.log('QR code recebido');
        setQrCode(data.qrCode);
        startStatusCheck(instanceId);
      } else {
        setTimeout(() => getQRCode(instanceId), 3000);
      }
    } catch (error) {
      console.error('Erro ao buscar QR code:', error);
      setTimeout(() => getQRCode(instanceId), 3000);
    }
  };

  const startStatusCheck = (instanceId: string) => {
    console.log('Iniciando verificação de status para:', instanceId);
    
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
          body: {
            action: 'check_status',
            connectionData: { instanceId }
          }
        });

        if (error) {
          console.error('Erro ao verificar status:', error);
          return;
        }

        console.log('Status da conexão:', data);

        if (data?.connected) {
          console.log('WhatsApp conectado com sucesso!');
          setConnectionStatus("connected");
          setStep(3);
        } else {
          setTimeout(() => checkStatus(), 3000);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setTimeout(() => checkStatus(), 5000);
      }
    };

    setTimeout(checkStatus, 2000);
  };

  const refreshQRCode = async () => {
    if (!instanceId) return;
    
    setIsLoading(true);
    setQrCode("");
    await getQRCode(instanceId);
    setIsLoading(false);
  };

  return {
    step,
    connectionName,
    setConnectionName,
    isLoading,
    qrCode,
    instanceId,
    connectionStatus,
    resetState,
    handleStartConnection,
    refreshQRCode
  };
}
