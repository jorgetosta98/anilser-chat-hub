
import { useParams } from "react-router-dom";
import { ChatWelcomeScreen } from "@/components/ChatWelcomeScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { MessageInput } from "@/components/MessageInput";
import { PageTransition } from "@/components/ui/page-transition";

export default function Chat() {
  const { chatId } = useParams();
  
  // Check if we're viewing a specific chat
  const isViewingChat = !!chatId;

  return (
    <PageTransition>
      <div className="flex h-screen bg-gray-50">
        {/* Main Chat Area - Full width now */}
        <div className="flex-1 flex flex-col">
          {isViewing Chat ? (
            <>
              <ChatInterface conversationId={chatId} />
              <MessageInput conversationId={chatId} isViewingChat={true} />
            </>
          ) : (
            <>
              <ChatWelcomeScreen />
              <MessageInput conversationId={null} />
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
