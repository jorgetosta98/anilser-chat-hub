
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface ChatMessage {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
}

export function ChatInterface({ messages }: ChatInterfaceProps) {
  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-6 max-w-4xl mx-auto w-full pb-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.message}
                isUser={msg.isUser}
                timestamp={msg.timestamp}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
