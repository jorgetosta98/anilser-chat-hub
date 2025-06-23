
export interface WhatsAppConnection {
  id?: string;
  instance_name: string;
  whatsapp_number: string;
  status?: string | null;
  connection_data?: any;
  created_at?: string;
  updated_at?: string;
}

export interface WhatsAppQRCodeResponse {
  qr_code?: string;
  image?: string;
  qrcode?: string;
  data?: {
    qr_code?: string;
  };
}

export interface WhatsAppStatusResponse {
  status?: string;
}
