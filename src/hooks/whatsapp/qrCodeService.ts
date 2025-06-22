
import { useToast } from "@/hooks/use-toast";
import { WhatsAppService } from "./whatsappService";
import type { WhatsAppConnectionState } from "./types";

export function useQRCodeService(
  updateState: (updates: Partial<WhatsAppConnectionState>) => void
) {
  const { toast } = useToast();

  const getQRCode = async (instanceId: string): Promise<void> => {
    try {
      console.log('Buscando QR code para instância:', instanceId);
      
      const data = await WhatsAppService.getQRCode(instanceId);

      if (data?.success && data.qrCode) {
        console.log('QR code recebido');
        updateState({ qrCode: data.qrCode });
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

  const refreshQRCode = async (instanceId: string): Promise<void> => {
    if (!instanceId) return;
    
    updateState({ isLoading: true, qrCode: "" });
    await getQRCode(instanceId);
    updateState({ isLoading: false });
  };

  return {
    getQRCode,
    refreshQRCode
  };
}
