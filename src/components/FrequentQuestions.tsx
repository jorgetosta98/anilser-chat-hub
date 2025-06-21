
import { Card, CardContent } from "@/components/ui/card";
import { useConversations } from "@/hooks/useConversations";
import { useUserFrequentQuestions } from "@/hooks/useUserFrequentQuestions";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Loader2 } from "lucide-react";

const defaultQuestions = [
  "Quais são os EPIs obrigatórios para trabalho em altura?",
  "Como elaborar um mapa de riscos eficiente?",
  "Qual a diferença entre acidente e incidente de trabalho?",
  "Como funciona a NR-12 sobre máquinas e equipamentos?",
  "Quais são as responsabilidades do técnico em segurança?",
  "Como implementar um programa de prevenção de acidentes?"
];

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

  // Show user's personal questions if they have any, otherwise show default questions
  const questionsToShow = questions.length > 0 ? questions.map(q => q.question) : defaultQuestions;
  const showPersonalQuestions = questions.length > 0;

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

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {showPersonalQuestions ? "Suas Perguntas Favoritas" : "Perguntas Frequentes"}
        </h2>
        {showPersonalQuestions && (
          <Heart className="w-5 h-5 text-red-500 fill-current" />
        )}
      </div>
      
      {!showPersonalQuestions && (
        <div className="text-center mb-4 p-4 bg-blue-50 rounded-lg">
          <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Suas perguntas mais curtidas aparecerão aqui! Continue conversando e avalie positivamente suas perguntas favoritas.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questionsToShow.map((question, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-primary"
            onClick={() => handleQuestionClick(question)}
          >
            <CardContent className="p-4">
              <p className="text-gray-700 text-sm">{question}</p>
              {showPersonalQuestions && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Heart className="w-3 h-3 text-red-500 fill-current" />
                  <span>Pergunta favorita</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
