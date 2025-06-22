
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";
import { ConversationItem } from "./ConversationItem";
import { ConfirmationModal } from "../modals/ConfirmationModal";

interface ConversationsListProps {
  isCollapsed: boolean;
}

export function ConversationsList({ isCollapsed }: ConversationsListProps) {
  const [showRecentChats, setShowRecentChats] = useState(true);
  const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null);
  
  const { conversations, updateConversation, deleteConversation } = useConversations();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const handleEdit = (id: string, title: string) => {
    updateConversation({ id, title });
  };

  const handleDeleteStart = (conversationId: string) => {
    setDeleteConversationId(conversationId);
  };

  const handleDeleteConfirm = () => {
    if (deleteConversationId) {
      deleteConversation(deleteConversationId);
      setDeleteConversationId(null);
      // Se a conversa sendo deletada é a atual, redirecionar para chat
      if (chatId === deleteConversationId) {
        navigate('/chat');
      }
    }
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <>
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
                onEdit={handleEdit}
                onDelete={handleDeleteStart}
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

      {/* Modal de Confirmação para Exclusão */}
      <ConfirmationModal
        isOpen={!!deleteConversationId}
        onClose={() => setDeleteConversationId(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Conversa"
        description="Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </>
  );
}
