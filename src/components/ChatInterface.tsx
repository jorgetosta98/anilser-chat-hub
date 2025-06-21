
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
    <div className="flex-1 relative">
      <ScrollArea className="h-full">
        <div className="p-8 max-w-5xl mx-auto w-full">
          <div className="space-y-2">
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
