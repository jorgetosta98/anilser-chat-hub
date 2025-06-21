
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Paperclip, Send, ArrowUp } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";

interface MessageInputProps {
  conversationId: string | null;
  isViewingChat?: boolean;
}

export function MessageInput({ conversationId, isViewingChat = false }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { addMessage, isAddingMessage } = useMessages(conversationId);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || isAddingMessage) return;

    const userMessage = message.trim();
    setMessage("");

    // Add user message
    addMessage({ content: userMessage, isUser: true });

    // Simulate AI response (in a real app, this would call your AI service)
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      addMessage({ content: aiResponse, isUser: false });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple AI response generator (replace with actual AI integration)
  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "Entendo sua questão sobre segurança do trabalho. Vou te ajudar com isso.",
      "Essa é uma pergunta importante sobre segurança ocupacional. Deixe-me fornecer algumas orientações.",
      "Com base na sua pergunta, posso te orientar sobre as melhores práticas de segurança.",
      "Vou te ajudar com essa questão de segurança. É importante seguir as normas regulamentadoras.",
      "Excelente pergunta! A segurança no trabalho é fundamental. Aqui estão algumas recomendações."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           "\n\nSua mensagem: \"" + userMessage + "\"\n\n" +
           "Esta é uma resposta simulada. Em um ambiente real, aqui estaria a resposta do assistente de IA especializado em segurança do trabalho.";
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-primary">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
            <Mic className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder={conversationId ? "Digite sua mensagem ou comando" : "Selecione uma conversa para começar"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 border-gray-300 focus:border-primary"
              disabled={!conversationId || isAddingMessage}
            />
            <Button 
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || !conversationId || isAddingMessage}
              className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary-700 disabled:opacity-50"
            >
              {isViewingChat ? <ArrowUp className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
