
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuickFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastMessage?: string;
  conversationId?: string;
}

export function QuickFeedbackModal({ 
  isOpen, 
  onClose, 
  lastMessage, 
  conversationId 
}: QuickFeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getPersonalizedQuestion = (message?: string) => {
    if (!message || message.length < 10) {
      return "Essa conversa foi produtiva?";
    }
    
    // Extrair palavras-chave da mensagem para personalizar
    const keywords = message.toLowerCase();
    
    if (keywords.includes("como fazer") || keywords.includes("como") || keywords.includes("receita")) {
      return "Conseguimos resolver sua dúvida?";
    } else if (keywords.includes("calcular") || keywords.includes("cálculo")) {
      return "O cálculo apresentado foi útil?";
    } else if (keywords.includes("norma") || keywords.includes("regulamento")) {
      return "As informações sobre normas foram esclarecedoras?";
    } else if (keywords.includes("documento") || keywords.includes("elaborar")) {
      return "O documento elaborado atendeu suas expectativas?";
    }
    
    return "Essa conversa foi produtiva?";
  };

  const handleFeedback = async (isPositive: boolean) => {
    if (!conversationId) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from("conversation_ratings")
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          rating: isPositive ? 5 : 1, // Positive = 5, Negative = 1
          feedback: isPositive ? "Positivo" : "Negativo" // Simple feedback
        });

      if (error) throw error;

      toast({
        title: "Obrigado pelo feedback!",
        description: "Sua avaliação nos ajuda a melhorar."
      });

      onClose();
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu feedback. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {getPersonalizedQuestion(lastMessage)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center space-x-8 py-6">
          <Button
            onClick={() => handleFeedback(true)}
            disabled={isSubmitting}
            variant="ghost"
            className="flex flex-col items-center p-6 hover:bg-green-50 hover:text-green-600 transition-colors"
          >
            <ThumbsUp className="w-12 h-12 mb-2" />
            <span>Sim</span>
          </Button>
          
          <Button
            onClick={() => handleFeedback(false)}
            disabled={isSubmitting}
            variant="ghost"
            className="flex flex-col items-center p-6 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <ThumbsDown className="w-12 h-12 mb-2" />
            <span>Não</span>
          </Button>
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-sm"
          >
            Pular avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
