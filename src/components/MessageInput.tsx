
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Send, ArrowUp, Database } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAI } from "@/hooks/useAI";
import { useConversations } from "@/hooks/useConversations";
import { useNavigate } from "react-router-dom";
import { useKnowledgeBase, KnowledgeBaseType } from "@/hooks/useKnowledgeBase";

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
  const { 
    selectedKnowledgeBase, 
    setSelectedKnowledgeBase, 
    getSelectedKnowledgeBase,
    knowledgeBases 
  } = useKnowledgeBase();

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

    // Generate AI response with knowledge base context
    try {
      const aiResponse = await generateResponse(userMessage, messages, selectedKnowledgeBase);
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

  const handleKnowledgeBaseChange = (value: string) => {
    setSelectedKnowledgeBase(value as KnowledgeBaseType);
  };

  const isLoading = isAddingMessage || isGenerating;

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Knowledge Base Selection */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">Base de Conhecimento:</span>
            <Select 
              value={selectedKnowledgeBase} 
              onValueChange={handleKnowledgeBaseChange}
            >
              <SelectTrigger className="w-64 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {knowledgeBases.map((kb) => (
                  <SelectItem key={kb.id} value={kb.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{kb.name}</span>
                      <span className="text-xs text-gray-500">{kb.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Message Input */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary"
          >
            <Mic className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder={`Digite sua pergunta (${getSelectedKnowledgeBase().name})...`}
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
