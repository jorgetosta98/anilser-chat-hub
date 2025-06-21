
import { QuickActionCards } from "./QuickActionCards";
import { FrequentQuestions } from "./FrequentQuestions";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import { useNavigate } from "react-router-dom";

export function ChatWelcomeScreen() {
  const { profile } = useAuth();
  const { createConversation } = useConversations();
  const navigate = useNavigate();
  
  const firstName = profile?.full_name?.split(' ')[0] || 'Usuário';

  const handleStartNewChat = () => {
    createConversation('Nova Conversa');
    // The conversation will be created and the user will see it in the sidebar
    // They can click on it to start chatting
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Olá, {firstName}!</h1>
        <p className="text-lg text-gray-600 mb-6">Como eu poderia te ajudar hoje?</p>
        
        <Button 
          onClick={handleStartNewChat}
          className="bg-primary hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Iniciar Nova Conversa
        </Button>
      </div>

      {/* Quick Action Cards */}
      <QuickActionCards />

      {/* Frequent Questions */}
      <FrequentQuestions />
    </div>
  );
}
