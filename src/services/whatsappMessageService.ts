
import { WhatsAppMessage } from '@/types/whatsappMessages';

// Serviço para processar mensagens recebidas de webhooks
export class WhatsAppMessageService {
  static processIncomingMessage(webhookData: any): Omit<WhatsAppMessage, 'id' | 'user_id' | 'created_at' | 'updated_at'> | null {
    try {
      // Adaptar dados do webhook para o formato da nossa base de dados
      // Esta função deve ser adaptada conforme o formato específico do seu webhook
      
      console.log('Processing incoming WhatsApp message:', webhookData);
      
      // Exemplo de estrutura (adapte conforme necessário)
      const message: Omit<WhatsAppMessage, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        connection_id: webhookData.connection_id || '',
        message_id: webhookData.message_id || webhookData.id || '',
        from_number: webhookData.from || webhookData.from_number || '',
        to_number: webhookData.to || webhookData.to_number || '',
        message_type: webhookData.type || 'text',
        content: webhookData.body || webhookData.text || webhookData.content || '',
        media_url: webhookData.media_url || webhookData.url || null,
        media_mimetype: webhookData.mimetype || null,
        timestamp: webhookData.timestamp ? new Date(webhookData.timestamp * 1000).toISOString() : new Date().toISOString(),
        is_from_me: webhookData.fromMe || false,
        status: webhookData.status || 'received',
        metadata: {
          original_webhook_data: webhookData
        }
      };

      return message;
    } catch (error) {
      console.error('Error processing incoming WhatsApp message:', error);
      return null;
    }
  }

  static formatMessageForDisplay(message: WhatsAppMessage): string {
    const timestamp = new Date(message.timestamp).toLocaleString('pt-BR');
    const direction = message.is_from_me ? 'Enviada' : 'Recebida';
    
    let content = '';
    switch (message.message_type) {
      case 'text':
        content = message.content || '';
        break;
      case 'image':
        content = '📷 Imagem';
        break;
      case 'audio':
        content = '🎵 Áudio';
        break;
      case 'video':
        content = '🎥 Vídeo';
        break;
      case 'document':
        content = '📄 Documento';
        break;
      default:
        content = `📎 ${message.message_type}`;
    }

    return `[${timestamp}] ${direction}: ${content}`;
  }

  static getConversationTitle(conversation: any, messages: WhatsAppMessage[]): string {
    if (conversation.participant_name) {
      return conversation.participant_name;
    }
    
    // Formatear número de telefone
    const number = conversation.participant_number;
    if (number.startsWith('55')) {
      return `+${number.substring(0, 2)} (${number.substring(2, 4)}) ${number.substring(4, 9)}-${number.substring(9)}`;
    }
    
    return number;
  }
}
