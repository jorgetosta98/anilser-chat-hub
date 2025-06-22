
import type { WebhookPayload } from './types.ts';

export async function sendWebhookNotification(payload: WebhookPayload) {
  try {
    console.log('Sending webhook notification with connection name and phone:', payload.connection_name, payload.phone_number);
    
    const webhookResponse = await fetch('https://n8n.vivendodemicrosaas.com.br/webhook-test/66b088e5-3560-4d0d-b460-ec7806144b71', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (webhookResponse.ok) {
      console.log('Webhook notification sent successfully');
    } else {
      console.error('Failed to send webhook notification:', await webhookResponse.text());
    }
  } catch (webhookError) {
    console.error('Error sending webhook notification:', webhookError);
    // Don't fail the whole process if webhook fails
  }
}
