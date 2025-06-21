
import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

type Message = Tables<'messages'>;

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.is_user;
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`mb-6 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'mr-4' : 'ml-4'}`}>
        <Card className={`p-4 ${isUser ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
          {isUser && (
            <div className="text-sm font-medium text-green-700 mb-2">Você:</div>
          )}
          <div className={`text-sm ${isUser ? 'text-green-800' : 'text-gray-800'} whitespace-pre-wrap leading-relaxed`}>
            {message.content}
          </div>
          {message.created_at && (
            <div className="text-xs text-gray-500 mt-3 text-right">
              {formatTimestamp(message.created_at)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
