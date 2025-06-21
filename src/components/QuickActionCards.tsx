
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, AlertTriangle, Users } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    title: "Normas Regulamentadoras",
    description: "Consulte informações sobre NRs",
    icon: FileText,
    prompt: "Me explique sobre as principais Normas Regulamentadoras (NRs) de segurança do trabalho"
  },
  {
    title: "EPIs e EPCs",
    description: "Equipamentos de proteção",
    icon: Shield,
    prompt: "Quais são os EPIs necessários para trabalho em altura e como utilizá-los corretamente?"
  },
  {
    title: "Acidentes de Trabalho",
    description: "Prevenção e procedimentos",
    icon: AlertTriangle,
    prompt: "Como proceder em caso de acidente de trabalho? Quais são os passos para prevenção?"
  },
  {
    title: "CIPA e SIPAT",
    description: "Comissões e treinamentos",
    icon: Users,
    prompt: "Como organizar uma CIPA eficiente e quais são as responsabilidades dos membros?"
  }
];

export function QuickActionCards() {
  const { createConversation } = useConversations();
  const navigate = useNavigate();

  const handleQuickAction = async (prompt: string) => {
    const newConversation = await createConversation('Nova Consulta');
    if (newConversation) {
      navigate(`/chat/${newConversation.id}`);
      
      // Simular o envio da mensagem após navegação
      setTimeout(() => {
        const messageInput = document.querySelector('input[placeholder*="Digite"]') as HTMLInputElement;
        const sendButton = document.querySelector('button[type="button"]:has(svg)') as HTMLButtonElement;
        
        if (messageInput && sendButton) {
          messageInput.value = prompt;
          messageInput.dispatchEvent(new Event('input', { bubbles: true }));
          sendButton.click();
        }
      }, 100);
    }
  };

  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Consultas Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-primary"
              onClick={() => handleQuickAction(action.prompt)}
            >
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
