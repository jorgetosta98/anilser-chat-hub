
export interface WhatsAppConnectionState {
  step: number;
  connectionName: string;
  phoneNumber: string;
  isLoading: boolean;
  qrCode: string;
  instanceId: string;
  connectionStatus: string;
}

export interface WhatsAppConnectionActions {
  setConnectionName: (name: string) => void;
  setPhoneNumber: (phone: string) => void;
  resetState: () => void;
  handleStartConnection: () => Promise<void>;
  refreshQRCode: () => Promise<void>;
}

export interface CreateInstanceResponse {
  success: boolean;
  instanceId: string;
  error?: string;
}

export interface QRCodeResponse {
  success: boolean;
  qrCode?: string;
  error?: string;
}

export interface StatusResponse {
  success: boolean;
  connected: boolean;
  status?: string;
  phone?: string;
  error?: string;
}
