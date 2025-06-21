
import { useParams } from "react-router-dom";
import { ChatWelcomeScreen } from "@/components/ChatWelcomeScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { MessageInput } from "@/components/MessageInput";

// Mock chat history data
const mockChatHistory: Record<number, Array<{
  id: number;
  message: string;
  isUser: boolean;
  timestamp: string;
}>> = {
  1: [
    {
      id: 1,
      message: "Olá, estou precisando de ajuda urgente. Durante uma inspeção de rotina, descobri que o nível de concentração de vapores de solventes na área de armazenamento de produtos químicos está acima do limite permitido pelas normas regulamentadoras. Já evacuei a área e estou verificando os equipamentos de ventilação, mas preciso saber quais medidas adicionais devo tomar para garantir a segurança dos trabalhadores e a conformidade com as regulamentações. Além disso, gostaria de orientações sobre como prevenir que isso ocorra novamente no futuro. Poderia me ajudar?",
      isUser: true,
      timestamp: "10:30"
    },
    {
      id: 2,
      message: "Claro, vou te ajudar com isso. Vamos dividir a resposta em duas partes: ações imediatas e medidas preventivas para o futuro.\n\nAções Imediatas:\n\n1. Monitoramento Contínuo:\n   • Utilize detectores de gás portáteis para monitorar continuamente os níveis de vapores até que voltem a níveis seguros.\n   • Mantenha registros detalhados dos níveis de concentração de vapores durante esse período.\n\n2. Verificação dos Equipamentos de Ventilação:\n   • Certifique-se de que os sistemas de ventilação estão funcionando corretamente.\n   • Se houver falhas, providencie reparos imediatos ou substituições.\n   • Considere a instalação de ventilação suplementar temporária para acelerar a dispersão dos vapores.\n\n3. Equipamentos de Proteção Individual (EPIs):\n   • Garanta que todos os trabalhadores que precisem acessar a área afetada usem EPIs adequados, como máscaras respiratórias com filtros específicos para solventes.\n   • Disponibilize outros EPIs conforme necessário, como luvas e roupas resistentes a produtos químicos.\n\n4. Isolamento da Área:\n   • Mantenha a área de armazenamento isolada até que os níveis de vapores estejam dentro dos limites seguros.\n   • Sinalize a área com avisos de perigo para evitar a entrada não autorizada.\n\n5. Comunicação e Documentação:\n   • Informe imediatamente a administração e os responsáveis pela segurança sobre a situação.\n   • Documente o incidente, as medidas tomadas e os resultados dos monitoramentos.",
      isUser: false,
      timestamp: "10:32"
    }
  ]
};

export default function Chat() {
  const { chatId } = useParams();
  
  // Check if we're viewing a specific chat
  const chatIdNumber = chatId ? parseInt(chatId, 10) : null;
  const isViewingChat = chatIdNumber && mockChatHistory[chatIdNumber];
  const chatMessages = isViewingChat ? mockChatHistory[chatIdNumber] : [];

  const handleSendMessage = (message: string) => {
    // In a real app, this would send the message to the backend
    console.log("Sending message:", message);
  };

  if (isViewingChat) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-gray-50">
        <ChatInterface messages={chatMessages} />
        <MessageInput onSendMessage={handleSendMessage} isViewingChat={true} />
      </div>
    );
  }

  // Default chat interface (welcome screen)
  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      <ChatWelcomeScreen />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
