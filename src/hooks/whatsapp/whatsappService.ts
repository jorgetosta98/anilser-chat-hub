
import { supabase } from "@/integrations/supabase/client";
import type { CreateInstanceResponse, QRCodeResponse, StatusResponse } from "./types";

export class WhatsAppService {
  static async createInstance(connectionName: string, phoneNumber: string): Promise<CreateInstanceResponse> {
    console.log('Criando instância WhatsApp com nome:', connectionName, 'e telefone:', phoneNumber);
    
    const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
      body: {
        action: 'create_instance',
        connectionData: {
          name: connectionName,
          phone: phoneNumber
        }
      }
    });

    if (error) {
      console.error('Erro ao criar instância:', error);
      throw error;
    }

    return data;
  }

  static async getQRCode(instanceId: string): Promise<QRCodeResponse> {
    console.log('Buscando QR code para instância:', instanceId);
    
    const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
      body: {
        action: 'get_qr_code',
        connectionData: { instanceId }
      }
    });

    if (error) {
      console.error('Erro ao buscar QR code:', error);
      throw error;
    }

    return data;
  }

  static async checkStatus(instanceId: string): Promise<StatusResponse> {
    const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
      body: {
        action: 'check_status',
        connectionData: { instanceId }
      }
    });

    if (error) {
      console.error('Erro ao verificar status:', error);
      throw error;
    }

    return data;
  }
}
