
import { useParams } from "react-router-dom";
import { ChatWelcomeScreen } from "@/components/ChatWelcomeScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { MessageInput } from "@/components/MessageInput";
import { ConversationsList } from "@/components/ConversationsList";

export default function Chat() {
  const { chatId } = useParams();
  
  // Check if we're viewing a specific chat
  const isViewingChat = !!chatId;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations List */}
      <ConversationsList />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {isViewingChat ? (
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
  );
}
