
import { WhatsAppQRCodeResponse, WhatsAppStatusResponse } from '@/types/whatsapp';

const WEBHOOK_BASE_URL = 'https://n8n.vivendodemicrosaas.com.br';
const QR_CODE_WEBHOOK = `${WEBHOOK_BASE_URL}/webhook-test/038b58f0-f085-47b5-98c7-cde82fd14391`;
const STATUS_CHECK_WEBHOOK = `${WEBHOOK_BASE_URL}/webhook/ec5f7a5f-0255-4c76-9397-df81ac442058`;

export async function generateQRCode(instanceName: string, whatsappNumber: string): Promise<string> {
  try {
    console.log('Gerando QR Code para:', { instanceName, whatsappNumber });
    
    const response = await fetch(QR_CODE_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instance_name: instanceName,
        whatsapp_number: whatsappNumber
      })
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    // Verificar o tipo de conteúdo da resposta
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (contentType?.includes('image/')) {
      // Se for uma imagem, converter para base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      return `data:${contentType};base64,${base64}`;
    } else {
      // Se for JSON ou texto
      const responseText = await response.text();
      console.log('Response text length:', responseText.length);
      console.log('Response text:', responseText.substring(0, 200)); // Primeiros 200 caracteres
      
      // Verificar se a resposta está vazia
      if (!responseText || responseText.trim() === '') {
        throw new Error('Webhook retornou resposta vazia. Verifique se o webhook está funcionando corretamente.');
      }
      
      try {
        const jsonData: WhatsAppQRCodeResponse = JSON.parse(responseText);
        console.log('Parsed JSON:', jsonData);
        
        if (jsonData.qr_code) {
          return jsonData.qr_code;
        } else if (jsonData.image) {
          return jsonData.image;
        } else if (jsonData.qrcode) {
          return jsonData.qrcode;
        } else if (jsonData.data && jsonData.data.qr_code) {
          return jsonData.data.qr_code;
        } else {
          console.error('Estrutura do JSON não reconhecida:', Object.keys(jsonData));
          throw new Error('Resposta do webhook não contém QR code em nenhum campo conhecido (qr_code, image, qrcode, data.qr_code)');
        }
      } catch (parseError) {
        console.error('Erro ao fazer parse do JSON:', parseError);
        console.error('Texto da resposta que causou erro:', responseText);
        
        // Se não conseguir fazer parse, pode ser que a resposta seja uma URL ou base64 diretamente
        if (responseText.startsWith('data:image/') || responseText.startsWith('http')) {
          return responseText;
        }
        
        throw new Error(`Erro ao processar resposta do webhook: ${parseError instanceof Error ? parseError.message : 'Erro desconhecido'}`);
      }
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export async function checkConnectionStatus(instanceName: string): Promise<WhatsAppStatusResponse> {
  try {
    console.log('Verificando status da conexão para:', instanceName);
    
    const response = await fetch(STATUS_CHECK_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instance_name: instanceName
      })
    });

    console.log('Status check response:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('Status response text:', responseText);
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Webhook de status retornou resposta vazia');
    }
    
    try {
      // Se a resposta for apenas "open" ou "close", criar o objeto esperado
      if (responseText.trim() === 'open') {
        return { connectionStatus: 'open' };
      } else if (responseText.trim() === 'close') {
        return { connectionStatus: 'close' };
      }
      
      // Tentar fazer parse como JSON
      const jsonData: WhatsAppStatusResponse = JSON.parse(responseText);
      console.log('Status parsed JSON:', jsonData);
      return jsonData;
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON de status:', parseError);
      console.error('Texto da resposta de status que causou erro:', responseText);
      throw new Error(`Erro ao processar resposta do webhook de status: ${parseError instanceof Error ? parseError.message : 'Erro desconhecido'}`);
    }
  } catch (error) {
    console.error('Error checking connection status:', error);
    throw error;
  }
}
