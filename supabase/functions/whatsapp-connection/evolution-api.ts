
import type { EvolutionApiConfig } from './types.ts';

export class EvolutionApiService {
  private config: EvolutionApiConfig;

  constructor(config: EvolutionApiConfig) {
    this.config = config;
  }

  async createInstance(instanceId: string) {
    const createPayload = {
      instanceName: instanceId,
      token: this.config.apiKey,
      qrcode: true
    };
    
    console.log('Create payload:', JSON.stringify(createPayload, null, 2));
    
    const createResponse = await fetch(`${this.config.baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey,
      },
      body: JSON.stringify(createPayload)
    });

    const responseText = await createResponse.text();
    console.log('Evolution API response status:', createResponse.status);
    console.log('Evolution API response:', responseText);

    if (!createResponse.ok) {
      console.error('Failed to create Evolution instance:', responseText);
      throw new Error(`Failed to create WhatsApp instance: ${responseText} (Status: ${createResponse.status})`);
    }

    let createResult;
    try {
      createResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Evolution API response:', parseError);
      createResult = { success: true, response: responseText };
    }
    
    console.log('Evolution instance created successfully:', createResult);
    return createResult;
  }

  async getQRCode(instanceId: string) {
    console.log('Getting QR code for instance:', instanceId);
    
    const qrResponse = await fetch(`${this.config.baseUrl}/instance/connect/${instanceId}`, {
      method: 'GET',
      headers: {
        'apikey': this.config.apiKey,
      }
    });

    if (!qrResponse.ok) {
      const errorText = await qrResponse.text();
      console.error('Failed to get QR code:', errorText);
      throw new Error(`Failed to get QR code: ${errorText}`);
    }

    const qrData = await qrResponse.json();
    console.log('QR code response:', qrData);
    
    return qrData.code || qrData.qrcode || qrData.base64;
  }

  async checkConnectionStatus(instanceId: string) {
    console.log('Checking status for instance:', instanceId);
    
    const statusResponse = await fetch(`${this.config.baseUrl}/instance/connectionState/${instanceId}`, {
      method: 'GET',
      headers: {
        'apikey': this.config.apiKey,
      }
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error('Failed to check status:', errorText);
      throw new Error('Failed to check status');
    }

    const statusData = await statusResponse.json();
    console.log('Status response:', statusData);
    
    return {
      isConnected: statusData.instance?.state === 'open',
      status: statusData.instance?.state,
      phone: statusData.instance?.owner
    };
  }

  async disconnectInstance(instanceId: string) {
    console.log('Disconnecting instance:', instanceId);
    
    await fetch(`${this.config.baseUrl}/instance/logout/${instanceId}`, {
      method: 'DELETE',
      headers: {
        'apikey': this.config.apiKey,
      }
    });
  }
}
