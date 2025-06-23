
import { FrequentQuestions } from "./FrequentQuestions";
import { useAuth } from "@/contexts/AuthContext";
import { useUserFrequentQuestions } from "@/hooks/useUserFrequentQuestions";
import { useChatbotInstructions } from "@/hooks/useChatbotInstructions";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function ChatWelcomeScreen() {
  const { profile, user } = useAuth();
  const { questions, isLoading } = useUserFrequentQuestions();
  const { fetchInstructions } = useChatbotInstructions();
  const [chatbotName, setChatbotName] = useState("");
  
  // Usar o nome da empresa se disponível, senão usar o nome do usuário
  const welcomeName = profile?.company || user?.user_metadata?.company || profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "Usuário";
  
  useEffect(() => {
    const loadChatbotConfig = async () => {
      if (user) {
        const instructions = await fetchInstructions();
        if (instructions && instructions.persona_name) {
          setChatbotName(instructions.persona_name);
        }
      }
    };
    
    loadChatbotConfig();
  }, [user, fetchInstructions]);
  
  console.log('ChatWelcomeScreen - Profile:', profile);
  console.log('ChatWelcomeScreen - User metadata:', user?.user_metadata);
  console.log('ChatWelcomeScreen - Welcome name:', welcomeName);
  console.log('ChatWelcomeScreen - Chatbot name:', chatbotName);
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Olá, {welcomeName}!</h1>
        {chatbotName && (
          <p className="text-xl text-gray-600 mb-4">Eu sou o {chatbotName}, seu assistente virtual!</p>
        )}
        <p className="text-xl text-gray-600 mb-8">Como eu poderia te ajudar hoje?</p>
      </div>

      {/* Frequent Questions - só aparece se houver perguntas favoritas */}
      <FrequentQuestions />
      
      {/* Mensagem quando não há perguntas favoritas */}
      {!isLoading && questions.length === 0 && (
        <div className="text-center p-8 bg-blue-50 rounded-lg max-w-2xl">
          <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Suas perguntas favoritas aparecerão aqui
          </h3>
          <p className="text-gray-600">
            Continue conversando e avalie positivamente suas perguntas favoritas para que elas apareçam aqui como atalhos rápidos.
          </p>
        </div>
      )}
    </div>
  );
}
