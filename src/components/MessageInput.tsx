
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Paperclip, Send, ArrowUp } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAI } from "@/hooks/useAI";
import { useConversations } from "@/hooks/useConversations";
import { useNavigate } from "react-router-dom";

interface MessageInputProps {
  conversationId: string | null;
  isViewingChat?: boolean;
}

export function MessageInput({ conversationId, isViewingChat = false }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { addMessage, isAddingMessage, messages } = useMessages(conversationId);
  const { generateResponse, isGenerating } = useAI();
  const { createConversation } = useConversations();
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (!message.trim() || isAddingMessage || isGenerating) return;

    const userMessage = message.trim();
    let currentConversationId = conversationId;

    // Se não há conversationId, criar uma nova conversa
    if (!currentConversationId) {
      const newConversation = await createConversation('Nova Conversa');
      if (newConversation) {
        currentConversationId = newConversation.id;
        navigate(`/chat/${newConversation.id}`);
        
        // Aguardar um pouco para garantir que a navegação ocorreu
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.error('Erro ao criar nova conversa');
        return;
      }
    }

    setMessage("");

    // Add user message
    addMessage({ content: userMessage, isUser: true });

    // Generate AI response
    try {
      const aiResponse = await generateResponse(userMessage, messages);
      addMessage({ content: aiResponse, isUser: false });
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      addMessage({ 
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.", 
        isUser: false 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isLoading = isAddingMessage || isGenerating;

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary"
          >
            <Mic className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua pergunta sobre segurança do trabalho..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 border-gray-300 focus:border-primary"
              disabled={isLoading}
            />
            <Button 
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary-700 disabled:opacity-50"
            >
              {isViewingChat ? <ArrowUp className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {isLoading && (
          <div className="text-center mt-2 text-sm text-gray-500">
            {isGenerating ? "SafeBoy está pensando..." : "Enviando mensagem..."}
          </div>
        )}
      </div>
    </div>
  );
}
