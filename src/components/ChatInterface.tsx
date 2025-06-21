
import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { useMessages } from "@/hooks/useMessages";
import { QuickFeedbackModal } from "./modals/QuickFeedbackModal";

interface ChatInterfaceProps {
  conversationId: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { messages, isLoading } = useMessages(conversationId);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasShownRating, setHasShownRating] = useState(false);

  // Show rating modal after user has had a meaningful conversation (5+ messages)
  useEffect(() => {
    if (messages && messages.length >= 5 && !hasShownRating) {
      const lastMessage = messages[messages.length - 1];
      // Show rating modal if the last message is from the AI
      if (!lastMessage.is_user) {
        const timer = setTimeout(() => {
          setShowRatingModal(true);
          setHasShownRating(true);
        }, 2000); // Wait 2 seconds after AI response

        return () => clearTimeout(timer);
      }
    }
  }, [messages, hasShownRating]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Carregando conversa...</div>
      </div>
    );
  }

  const lastMessage = messages && messages.length > 0 
    ? messages[messages.length - 1]?.content 
    : undefined;

  return (
    <>
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

      <QuickFeedbackModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        conversationId={conversationId}
        lastMessage={lastMessage}
      />
    </>
  );
}
