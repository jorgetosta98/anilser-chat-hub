
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppMessage } from "@/types/whatsappMessages";
import { WhatsAppMessageService } from "@/services/whatsappMessageService";

interface WhatsAppMessagesListProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
}

export function WhatsAppMessagesList({ messages, isLoading }: WhatsAppMessagesListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Carregando mensagens...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500">Nenhuma mensagem encontrada</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className={`${message.is_from_me ? 'ml-8 bg-green-50' : 'mr-8 bg-gray-50'}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {message.is_from_me ? 'Você' : message.from_number}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={message.message_type === 'text' ? 'default' : 'secondary'}>
                  {message.message_type}
                </Badge>
                <Badge variant={message.status === 'read' ? 'default' : 'outline'}>
                  {message.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {message.content && (
                <p className="text-sm text-gray-800">{message.content}</p>
              )}
              
              {message.media_url && (
                <div className="text-sm text-blue-600">
                  <a href={message.media_url} target="_blank" rel="noopener noreferrer">
                    📎 Mídia anexa ({message.media_mimetype})
                  </a>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString('pt-BR')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
