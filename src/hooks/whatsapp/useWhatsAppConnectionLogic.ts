
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppService } from "./whatsappService";
import { useQRCodeService } from "./qrCodeService";
import { useStatusService } from "./statusService";
import type { WhatsAppConnectionState } from "./types";

export function useWhatsAppConnectionLogic(
  state: WhatsAppConnectionState,
  updateState: (updates: Partial<WhatsAppConnectionState>) => void
) {
  const { toast } = useToast();
  const { getQRCode, refreshQRCode: refreshQRCodeService } = useQRCodeService(updateState);
  const { startStatusCheck } = useStatusService(updateState);

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
          startStatusCheck(data.instanceId);
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
  }, [state.connectionName, state.phoneNumber, toast, updateState, getQRCode, startStatusCheck]);

  const refreshQRCode = useCallback(async () => {
    await refreshQRCodeService(state.instanceId);
  }, [state.instanceId, refreshQRCodeService]);

  return {
    handleStartConnection,
    refreshQRCode
  };
}
