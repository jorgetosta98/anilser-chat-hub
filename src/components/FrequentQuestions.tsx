
import { Card, CardContent } from "@/components/ui/card";
import { useConversations } from "@/hooks/useConversations";
import { useUserFrequentQuestions } from "@/hooks/useUserFrequentQuestions";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Loader2 } from "lucide-react";

export function FrequentQuestions() {
  const { createConversation } = useConversations();
  const { questions, isLoading } = useUserFrequentQuestions();
  const navigate = useNavigate();

  const handleQuestionClick = async (question: string) => {
    const newConversation = await createConversation('Pergunta Frequente');
    if (newConversation) {
      navigate(`/chat/${newConversation.id}`);
      
      // Simular o envio da pergunta após navegação
      setTimeout(() => {
        const messageInput = document.querySelector('input[placeholder*="Digite"]') as HTMLInputElement;
        const sendButton = document.querySelector('button[type="button"]:has(svg)') as HTMLButtonElement;
        
        if (messageInput && sendButton) {
          messageInput.value = question;
          messageInput.dispatchEvent(new Event('input', { bubbles: true }));
          sendButton.click();
        }
      }, 100);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Perguntas Frequentes</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Se não há perguntas favoritas, não exibe nada
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Suas Perguntas Favoritas
        </h2>
        <Heart className="w-5 h-5 text-red-500 fill-current" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((question, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-primary"
            onClick={() => handleQuestionClick(question.question)}
          >
            <CardContent className="p-4">
              <p className="text-gray-700 text-sm">{question.question}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span>Pergunta favorita</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
