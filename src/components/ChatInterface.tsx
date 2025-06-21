
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useMessages } from "@/hooks/useMessages";
import { useEffect, useRef } from "react";

interface ChatInterfaceProps {
  conversationId: string | null;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { messages, isLoading } = useMessages(conversationId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Carregando mensagens...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="p-8 max-w-5xl mx-auto w-full">
          <div className="space-y-2">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Esta conversa está vazia.</p>
                <p className="text-sm">Envie uma mensagem para começar!</p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
