
import { useWhatsAppConnectionState } from "./useWhatsAppConnectionState";
import { useWhatsAppConnectionLogic } from "./useWhatsAppConnectionLogic";
import type { WhatsAppConnectionActions } from "./types";

export function useWhatsAppConnection(): WhatsAppConnectionActions & {
  step: number;
  connectionName: string;
  phoneNumber: string;
  isLoading: boolean;
  qrCode: string;
  instanceId: string;
  connectionStatus: string;
} {
  const {
    state,
    updateState,
    resetState,
    handleConnectionNameChange,
    handlePhoneNumberChange
  } = useWhatsAppConnectionState();

  const {
    handleStartConnection,
    refreshQRCode
  } = useWhatsAppConnectionLogic(state, updateState);

  return {
    // State
    step: state.step,
    connectionName: state.connectionName,
    phoneNumber: state.phoneNumber,
    isLoading: state.isLoading,
    qrCode: state.qrCode,
    instanceId: state.instanceId,
    connectionStatus: state.connectionStatus,
    
    // Actions
    setConnectionName: handleConnectionNameChange,
    setPhoneNumber: handlePhoneNumberChange,
    resetState,
    handleStartConnection,
    refreshQRCode
  };
}
