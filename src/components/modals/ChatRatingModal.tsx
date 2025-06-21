
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

export function ChatRatingModal({ isOpen, onClose, conversationId }: ChatRatingModalProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma avaliação de 1 a 5 estrelas.",
        variant: "destructive"
      });
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
          rating,
          feedback: feedback.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Avaliação enviada",
        description: "Obrigado pelo seu feedback!"
      });

      onClose();
      setRating(0);
      setFeedback("");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação. Tente novamente.",
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
          <DialogTitle>Avalie esta conversa</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Como você avaliaria a qualidade desta conversa?
            </p>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Comentários (opcional)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Compartilhe sua experiência ou sugestões..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
