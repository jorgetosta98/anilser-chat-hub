
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { regularBottomMenuItems } from "./menuData";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { QuickFeedbackModal } from "../modals/QuickFeedbackModal";
import { NewConversationButton } from "./NewConversationButton";
import { ConversationsList } from "./ConversationsList";

interface RegularUserSidebarProps {
  isCollapsed: boolean;
}

export function RegularUserSidebar({ isCollapsed }: RegularUserSidebarProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { conversations, updateConversation } = useConversations();
  const navigate = useNavigate();
  const { chatId } = useParams();
  
  // Buscar mensagens da conversa atual para o modal de feedback
  const { messages } = useMessages(chatId || null);

  const handleNewConversation = async () => {
    // Se há uma conversa ativa, mostrar modal de avaliação primeiro
    if (chatId && messages && messages.length > 0) {
      setShowFeedbackModal(true);
    } else {
      // Se não há conversa ativa, ir diretamente para a tela inicial
      navigate('/chat');
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    // Após o feedback, redirecionar para a tela inicial
    navigate('/chat');
  };

  // Obter a última mensagem para personalizar o modal
  const lastMessage = messages && messages.length > 0 
    ? messages[messages.length - 1]?.content 
    : undefined;

  return (
    <>
      {/* Top Menu Items */}
      <NewConversationButton 
        onClick={handleNewConversation}
        isCollapsed={isCollapsed}
      />

      {/* Recent Chats List - Fixed height, no scroll */}
      <ConversationsList
        conversations={conversations}
        onUpdateConversation={updateConversation}
        isCollapsed={isCollapsed}
      />

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

      {/* Modal de Feedback para avaliar conversa anterior */}
      <QuickFeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        conversationId={chatId}
        lastMessage={lastMessage}
      />
    </>
  );
}
