
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { WhatsAppConversation } from "@/types/whatsappMessages";
import { WhatsAppMessageService } from "@/services/whatsappMessageService";

interface WhatsAppConversationsListProps {
  conversations: WhatsAppConversation[];
  isLoading: boolean;
  onSelectConversation: (conversation: WhatsAppConversation) => void;
  selectedConversation?: WhatsAppConversation;
}

export function WhatsAppConversationsList({ 
  conversations, 
  isLoading, 
  onSelectConversation, 
  selectedConversation 
}: WhatsAppConversationsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Carregando conversas...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 p-3 bg-gray-100 rounded-full">
          <MessageSquare className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma conversa encontrada
        </h3>
        <p className="text-gray-600">
          As conversas aparecerão aqui quando você receber mensagens
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation?.id === conversation.id;
        const title = WhatsAppMessageService.getConversationTitle(conversation, []);
        
        return (
          <Card 
            key={conversation.id} 
            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
              isSelected ? 'ring-2 ring-primary bg-primary-50' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{title}</p>
                    <p className="text-sm text-gray-600">{conversation.participant_number}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {(conversation.unread_count || 0) > 0 && (
                    <Badge variant="default">
                      {conversation.unread_count}
                    </Badge>
                  )}
                  
                  {conversation.last_message_at && (
                    <div className="text-xs text-gray-500">
                      {new Date(conversation.last_message_at).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
