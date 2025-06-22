
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuickFeedbackModal } from "../modals/QuickFeedbackModal";
import { useMessages } from "@/hooks/useMessages";

interface NewConversationButtonProps {
  isCollapsed: boolean;
}

export function NewConversationButton({ isCollapsed }: NewConversationButtonProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
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
      <div className="p-4 space-y-2 border-b border-sidebar-border">
        <Button
          onClick={handleNewConversation}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-white"
        >
          <MessageSquare className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Nova Conversa</span>}
        </Button>
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
