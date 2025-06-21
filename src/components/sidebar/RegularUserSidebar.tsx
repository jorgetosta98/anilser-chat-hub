
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { regularTopMenuItems, regularBottomMenuItems } from "./menuData";
import { useConversations } from "@/hooks/useConversations";
import { Button } from "@/components/ui/button";

interface RegularUserSidebarProps {
  isCollapsed: boolean;
}

export function RegularUserSidebar({ isCollapsed }: RegularUserSidebarProps) {
  const [showRecentChats, setShowRecentChats] = useState(true);
  const { conversations, createConversation } = useConversations();
  const navigate = useNavigate();

  const handleNewConversation = async () => {
    const newConversation = await createConversation('Nova Conversa');
    if (newConversation) {
      navigate(`/chat/${newConversation.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <>
      {/* Top Menu Items */}
      <div className="p-4 space-y-2 border-b border-sidebar-border">
        <Button
          onClick={handleNewConversation}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-white"
        >
          <MessageSquare className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Nova Conversa</span>}
        </Button>
      </div>

      {/* Recent Chats List - Fixed height, no scroll */}
      {!isCollapsed && (
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
                <SidebarMenuItem
                  key={conversation.id}
                  item={{
                    title: conversation.title,
                    icon: MessageSquare,
                    path: `/chat/${conversation.id}`
                  }}
                  isCollapsed={false}
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
      )}

      {/* Bottom Menu Items */}
      <div className="mt-auto">
        <div className="p-4 space-y-2 border-t border-sidebar-border">
          {regularBottomMenuItems.map(item => (
            <SidebarMenuItem
              key={item.title}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </>
  );
}
