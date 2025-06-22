
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ConversationItem } from "./ConversationItem";

interface ConversationsListProps {
  conversations: Array<{
    id: string;
    title: string;
    updated_at?: string;
    created_at?: string;
  }>;
  onUpdateConversation: (data: { id: string; title: string }) => void;
  isCollapsed: boolean;
}

export function ConversationsList({ conversations, onUpdateConversation, isCollapsed }: ConversationsListProps) {
  const [showRecentChats, setShowRecentChats] = useState(true);
  const { chatId } = useParams();

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex-1 min-h-0">
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
            Conversas Recentes
          </h3>
          <button
            onClick={() => setShowRecentChats(!showRecentChats)}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            {showRecentChats ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="space-y-1 flex-1 relative">
          {conversations.slice(0, 9).map(conversation => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={chatId === conversation.id}
              onUpdateTitle={(id, title) => onUpdateConversation({ id, title })}
            />
          ))}
          {conversations.length === 0 && (
            <div className="text-center py-4 text-sidebar-foreground/70">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma conversa ainda</p>
            </div>
          )}
          {!showRecentChats && (
            <div className="absolute inset-0 backdrop-blur-sm bg-sidebar-background/30 flex items-center justify-center">
              <div className="text-sidebar-foreground/70 text-sm font-medium bg-sidebar-background/80 px-3 py-2 rounded-md border border-sidebar-border">
                Conversas ocultas
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
