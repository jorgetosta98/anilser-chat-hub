
import { useState, useCallback } from "react";
import type { WhatsAppConnectionState } from "./types";

const initialState: WhatsAppConnectionState = {
  step: 1,
  connectionName: "",
  phoneNumber: "",
  isLoading: false,
  qrCode: "",
  instanceId: "",
  connectionStatus: "disconnected"
};

export function useWhatsAppConnectionState() {
  const [state, setState] = useState<WhatsAppConnectionState>(initialState);

  const updateState = useCallback((updates: Partial<WhatsAppConnectionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    console.log('Resetando estado do hook');
    setState(initialState);
  }, []);

  const handleConnectionNameChange = useCallback((name: string) => {
    console.log('Nome da conexão alterado:', name);
    updateState({ connectionName: name });
  }, [updateState]);

  const handlePhoneNumberChange = useCallback((phone: string) => {
    console.log('Número do telefone alterado:', phone);
    updateState({ phoneNumber: phone });
  }, [updateState]);

  return {
    state,
    updateState,
    resetState,
    handleConnectionNameChange,
    handlePhoneNumberChange
  };
}
