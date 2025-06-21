
import { Card, CardContent } from "@/components/ui/card";
import { useConversations } from "@/hooks/useConversations";
import { useNavigate } from "react-router-dom";

const frequentQuestions = [
  "Quais são os EPIs obrigatórios para trabalho em altura?",
  "Como elaborar um mapa de riscos eficiente?",
  "Qual a diferença entre acidente e incidente de trabalho?",
  "Como funciona a NR-12 sobre máquinas e equipamentos?",
  "Quais são as responsabilidades do técnico em segurança?",
  "Como implementar um programa de prevenção de acidentes?"
];

export function FrequentQuestions() {
  const { createConversation } = useConversations();
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

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Perguntas Frequentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {frequentQuestions.map((question, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-primary"
            onClick={() => handleQuestionClick(question)}
          >
            <CardContent className="p-4">
              <p className="text-gray-700 text-sm">{question}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
