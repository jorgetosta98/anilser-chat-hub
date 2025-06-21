
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Paperclip, Send, Lightbulb, FileText, Volume2, ArrowUp } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";

const quickQuestions = [
  "Tire minhas dúvidas sobre uma norma",
  "Analise um documento e me dê uma resposta", 
  "Escute minhas dúvidas e me oriente"
];

const frequentQuestions = [
  {
    category: "Consultoria de Normas e Regulamentações",
    questions: [
      "Quais são as exigências da NR-35 para trabalhos em altura?",
      "Como identificar os riscos mais comuns em um ambiente de construção civil?"
    ]
  },
  {
    category: "Avaliação e Mitigação de Riscos", 
    questions: [
      "Quais medidas preventivas adotar para evitar acidentes com máquinas pesadas?",
      "Quais são as melhores práticas para a avaliação de riscos ergonômicos?"
    ]
  }
];

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
  const [message, setMessage] = useState("");
  const { chatId } = useParams();
  
  // Check if we're viewing a specific chat
  const chatIdNumber = chatId ? parseInt(chatId, 10) : null;
  const isViewingChat = chatIdNumber && mockChatHistory[chatIdNumber];
  const chatMessages = isViewingChat ? mockChatHistory[chatIdNumber] : [];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isViewingChat) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-gray-50">
        {/* Chat History Content */}
        <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.message}
                isUser={msg.isUser}
                timestamp={msg.timestamp}
              />
            ))}
          </div>
        </div>

        {/* Message Input */}
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
                  placeholder="Digite sua mensagem ou comando"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12 border-gray-300 focus:border-primary"
                />
                <Button 
                  size="icon"
                  onClick={handleSendMessage}
                  className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary-700"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default chat interface (welcome screen)
  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Olá, Maria!</h1>
          <p className="text-lg text-gray-600">Como eu poderia te ajudar hoje?</p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 w-full max-w-3xl">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-gray-700">{quickQuestions[0]}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-gray-700">{quickQuestions[1]}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-gray-707">{quickQuestions[2]}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frequent Questions */}
        <div className="w-full max-w-4xl mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
            Ou experimente sanar as dúvidas mais frequentes:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {frequentQuestions.map((category, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-800 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.questions.map((question, qIndex) => (
                    <div key={qIndex} className="flex items-start space-x-3">
                      <div className="p-1 bg-primary-50 rounded">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="text-sm text-gray-700 cursor-pointer hover:text-primary transition-colors">
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More Questions Link */}
        <Button variant="link" className="text-primary hover:text-primary-700 mb-8">
          Ver mais perguntas →
        </Button>
      </div>

      {/* Message Input */}
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
                placeholder="Digite sua mensagem ou comando"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 border-gray-300 focus:border-primary"
              />
              <Button 
                size="icon"
                onClick={handleSendMessage}
                className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
