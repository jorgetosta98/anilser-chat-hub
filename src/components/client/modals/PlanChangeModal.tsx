
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Safeboy Básico",
    price: 29.90,
    period: "mensal",
    features: ["100 mensagens/mês", "Suporte básico", "1 conexão WhatsApp"]
  },
  {
    id: "professional",
    name: "Safeboy Profissional",
    price: 79.90,
    period: "mensal",
    features: ["500 mensagens/mês", "Suporte prioritário", "3 conexões WhatsApp", "Relatórios avançados"],
    recommended: true
  },
  {
    id: "annual",
    name: "Safeboy Assinatura Anual",
    price: 647.97,
    period: "anual",
    features: ["Mensagens ilimitadas", "Suporte 24/7", "Conexões ilimitadas", "Todos os recursos"]
  }
];

interface PlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

export function PlanChangeModal({
  isOpen,
  onClose,
  currentPlan = "annual"
}: PlanChangeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (selectedPlan === currentPlan) {
      toast({
        title: "Aviso",
        description: "Você já está no plano selecionado.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPlan = plans.find(p => p.id === selectedPlan);
      toast({
        title: "Plano alterado",
        description: `Seu plano foi alterado para ${newPlan?.name} com sucesso.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar seu plano. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Alterar Plano"
      onSubmit={handleSubmit}
      submitText="Confirmar Alteração"
      isLoading={isLoading}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <p className="text-gray-600">Selecione o plano que melhor atende às suas necessidades:</p>
        
        <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
          {plans.map((plan) => (
            <div key={plan.id} className="relative">
              <div className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedPlan === plan.id ? 'border-primary bg-primary-50' : 'border-gray-200'
              }`}>
                <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={plan.id} className="text-base font-semibold cursor-pointer">
                        {plan.name}
                      </Label>
                      {plan.recommended && (
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          Recomendado
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">R$ {plan.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">/{plan.period}</p>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {currentPlan === plan.id && (
                <Badge className="absolute -top-2 -right-2 bg-blue-100 text-blue-800">
                  Plano Atual
                </Badge>
              )}
            </div>
          ))}
        </RadioGroup>
        
        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
          <p><strong>Importante:</strong> A alteração do plano será efetivada imediatamente. Valores serão ajustados proporcionalmente no próximo ciclo de cobrança.</p>
        </div>
      </div>
    </FormModal>
  );
}
