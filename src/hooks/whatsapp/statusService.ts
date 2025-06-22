
import { WhatsAppService } from "./whatsappService";
import type { WhatsAppConnectionState } from "./types";

export function useStatusService(
  updateState: (updates: Partial<WhatsAppConnectionState>) => void
) {
  const startStatusCheck = (instanceId: string): void => {
    console.log('Iniciando verificação de status para:', instanceId);
    
    const checkStatus = async (): Promise<void> => {
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

  return {
    startStatusCheck
  };
}
