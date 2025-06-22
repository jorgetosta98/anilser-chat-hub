
import { useEffect } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { useToast } from "@/hooks/use-toast";
import { useWhatsAppConnection } from "@/hooks/whatsapp/useWhatsAppConnection";
import { ConnectionNameStep } from "./ConnectionNameStep";
import { QRCodeStep } from "./QRCodeStep";
import { SuccessStep } from "./SuccessStep";

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
    phoneNumber,
    setConnectionName,
    setPhoneNumber,
    isLoading,
    qrCode,
    instanceId,
    connectionStatus,
    resetState,
    handleStartConnection,
    refreshQRCode
  } = useWhatsAppConnection();

  // Reset state only when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  // Handle connection success
  useEffect(() => {
    if (connectionStatus === "connected" && step === 3) {
      const successTimeout = setTimeout(() => {
        onConnect({
          id: instanceId,
          name: connectionName,
          phone: phoneNumber,
          status: "connected",
          connectedAt: new Date().toISOString()
        });
        toast({
          title: "Sucesso",
          description: "WhatsApp conectado com sucesso!"
        });
        onClose();
      }, 2000);

      return () => clearTimeout(successTimeout);
    }
  }, [connectionStatus, step, instanceId, connectionName, phoneNumber, onConnect, onClose, toast]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ConnectionNameStep
            connectionName={connectionName}
            phoneNumber={phoneNumber}
            onConnectionNameChange={setConnectionName}
            onPhoneNumberChange={setPhoneNumber}
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
