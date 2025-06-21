
import { ChatMessage } from "./ChatMessage";
import { useMessages } from "@/hooks/useMessages";

interface ChatInterfaceProps {
  conversationId: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { messages, isLoading } = useMessages(conversationId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Carregando conversa...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {messages?.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </div>
  );
}
