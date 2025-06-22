
import { useEffect } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { useToast } from "@/hooks/use-toast";
import { useWhatsAppConnection } from "@/hooks/useWhatsAppConnection";
import { ConnectionNameStep } from "./whatsapp/ConnectionNameStep";
import { QRCodeStep } from "./whatsapp/QRCodeStep";
import { SuccessStep } from "./whatsapp/SuccessStep";

interface WhatsAppConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (connectionData: any) => void;
}

export function WhatsAppConnectionModal({ isOpen, onClose, onConnect }: WhatsAppConnectionModalProps) {
  const { toast } = useToast();
  const {
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
  } = useWhatsAppConnection();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  // Handle connection success
  useEffect(() => {
    if (connectionStatus === "connected" && step === 3) {
      setTimeout(() => {
        onConnect({
          id: instanceId,
          name: connectionName,
          status: "connected",
          connectedAt: new Date().toISOString()
        });
        toast({
          title: "Sucesso",
          description: "WhatsApp conectado com sucesso!"
        });
        onClose();
      }, 2000);
    }
  }, [connectionStatus, step, instanceId, connectionName, onConnect, onClose, toast]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ConnectionNameStep
            connectionName={connectionName}
            onConnectionNameChange={setConnectionName}
          />
        );

      case 2:
        return (
          <QRCodeStep
            qrCode={qrCode}
            isLoading={isLoading}
            onRefreshQRCode={refreshQRCode}
          />
        );

      case 3:
        return (
          <SuccessStep
            connectionName={connectionName}
            instanceId={instanceId}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Conexão WhatsApp"
      onSubmit={step === 1 ? handleStartConnection : undefined}
      submitText={step === 1 ? (isLoading ? "Criando..." : "Criar Conexão") : undefined}
      isLoading={isLoading}
      maxWidth="max-w-2xl"
    >
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
    </FormModal>
  );
}
