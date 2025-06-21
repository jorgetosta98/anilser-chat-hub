
import { useState } from "react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const cancelReasons = [
  { id: "expensive", label: "Muito caro para minha necessidade" },
  { id: "not-using", label: "Não estou usando o suficiente" },
  { id: "technical-issues", label: "Problemas técnicos" },
  { id: "poor-support", label: "Suporte inadequado" },
  { id: "competitor", label: "Encontrei uma alternativa melhor" },
  { id: "other", label: "Outro motivo" }
];

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  planName = "Safeboy Assinatura Anual"
}: CancelSubscriptionModalProps) {
  const [step, setStep] = useState<'reason' | 'confirm'>('reason');
  const [selectedReason, setSelectedReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNext = () => {
    if (!selectedReason) {
      toast({
        title: "Selecione um motivo",
        description: "Por favor, selecione o motivo do cancelamento.",
        variant: "destructive",
      });
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada. Você continuará tendo acesso até o final do período pago.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar sua assinatura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('reason');
    setSelectedReason("");
    setFeedback("");
    setIsLoading(false);
    onClose();
  };

  if (step === 'confirm') {
    const reasonLabel = cancelReasons.find(r => r.id === selectedReason)?.label || selectedReason;
    
    return (
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Confirmar Cancelamento"
        description={`Tem certeza que deseja cancelar sua assinatura do ${planName}? Você continuará tendo acesso aos recursos até o final do período pago. Motivo: ${reasonLabel}`}
        confirmText="Sim, cancelar assinatura"
        cancelText="Voltar"
        isDestructive={true}
      />
    );
  }

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleNext}
      title="Cancelar Assinatura"
      confirmText="Continuar"
      cancelText="Voltar"
      description=""
    >
      <div className="space-y-4 py-4">
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">Lamentamos que você queira partir!</h3>
          <p className="text-gray-600 mb-4">
            Antes de prosseguir, gostaríamos de entender o motivo do cancelamento para melhorarmos nosso serviço.
          </p>
        </div>
        
        <div>
          <Label className="text-base font-medium">Por que você deseja cancelar?</Label>
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="mt-3">
            {cancelReasons.map((reason) => (
              <div key={reason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.id} id={reason.id} />
                <Label htmlFor={reason.id} className="cursor-pointer">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="feedback">Comentários adicionais (opcional)</Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Compartilhe sua experiência e sugestões..."
            className="mt-2"
            rows={3}
          />
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Antes de cancelar, considere:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Você pode pausar sua assinatura por até 3 meses</li>
            <li>• Oferecemos desconto de 50% por 2 meses para usuários leais</li>
            <li>• Suporte técnico gratuito para resolver qualquer problema</li>
          </ul>
        </div>
      </div>
    </ConfirmationModal>
  );
}
