
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppService } from "./whatsappService";
import type { WhatsAppConnectionState } from "./types";

export function useWhatsAppConnectionLogic(
  state: WhatsAppConnectionState,
  updateState: (updates: Partial<WhatsAppConnectionState>) => void
) {
  const { toast } = useToast();

  const handleStartConnection = useCallback(async () => {
    console.log('Iniciando conexão com nome:', state.connectionName, 'e telefone:', state.phoneNumber);
    
    if (!state.connectionName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da conexão é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!state.phoneNumber.trim()) {
      toast({
        title: "Erro",
        description: "Número de telefone é obrigatório",
        variant: "destructive"
      });
      return;
    }

    updateState({ isLoading: true });
    try {
      const data = await WhatsAppService.createInstance(state.connectionName, state.phoneNumber);

      if (data?.success) {
        console.log('Instância criada com sucesso:', data.instanceId);
        updateState({ 
          instanceId: data.instanceId,
          step: 2
        });
        
        setTimeout(async () => {
          await getQRCode(data.instanceId);
        }, 2000);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao criar instância WhatsApp",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erro:', error);
      
      // Tratamento específico para erro de autorização
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        toast({
          title: "Erro de Configuração",
          description: "Verifique se as chaves da API Evolution estão configuradas corretamente",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao criar conexão WhatsApp. Verifique os logs do servidor.",
          variant: "destructive"
        });
      }
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.connectionName, state.phoneNumber, toast, updateState]);

  const getQRCode = async (instanceId: string) => {
    try {
      console.log('Buscando QR code para instância:', instanceId);
      
      const data = await WhatsAppService.getQRCode(instanceId);

      if (data?.success && data.qrCode) {
        console.log('QR code recebido');
        updateState({ qrCode: data.qrCode });
        startStatusCheck(instanceId);
      } else {
        setTimeout(() => getQRCode(instanceId), 3000);
      }
    } catch (error) {
      console.error('Erro ao buscar QR code:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar QR code",
        variant: "destructive"
      });
      setTimeout(() => getQRCode(instanceId), 3000);
    }
  };

  const startStatusCheck = (instanceId: string) => {
    console.log('Iniciando verificação de status para:', instanceId);
    
    const checkStatus = async () => {
      try {
        const data = await WhatsAppService.checkStatus(instanceId);

        console.log('Status da conexão:', data);

        if (data?.connected) {
          console.log('WhatsApp conectado com sucesso!');
          updateState({ 
            connectionStatus: "connected",
            step: 3
          });
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

  const refreshQRCode = useCallback(async () => {
    if (!state.instanceId) return;
    
    updateState({ isLoading: true, qrCode: "" });
    await getQRCode(state.instanceId);
    updateState({ isLoading: false });
  }, [state.instanceId, updateState]);

  return {
    handleStartConnection,
    refreshQRCode
  };
}
