
import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessageRating } from "@/hooks/useMessageRating";

interface QuickFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string;
  lastMessage?: string;
}

export function QuickFeedbackModal({ 
  isOpen, 
  onClose, 
  conversationId,
  lastMessage 
}: QuickFeedbackModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [step, setStep] = useState<'rating' | 'feedback'>('rating');
  const { submitRating, isSubmitting } = useMessageRating();

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
    if (selectedRating <= 3) {
      setStep('feedback');
    } else {
      handleSubmit(selectedRating);
    }
  };

  const handleSubmit = async (finalRating: number = rating!) => {
    if (!conversationId || !lastMessage) return;

    await submitRating(conversationId, lastMessage, finalRating, feedback);
    
    // Reset state
    setRating(null);
    setFeedback("");
    setStep('rating');
    onClose();
  };

  const handleSkip = () => {
    setRating(null);
    setFeedback("");
    setStep('rating');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Como foi nossa conversa?
          </DialogTitle>
        </DialogHeader>

        {step === 'rating' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Avalie sua experiência para nos ajudar a melhorar
              </p>
              
              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRatingSelect(star)}
                    className="p-1 hover:bg-primary/10"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        rating && rating >= star 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </Button>
                ))}
              </div>

              {/* Quick thumbs */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleRatingSelect(2)}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Não ajudou
                </Button>
                <Button
                  onClick={() => handleRatingSelect(5)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Muito útil!
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="ghost" onClick={handleSkip}>
                Pular avaliação
              </Button>
            </div>
          </div>
        )}

        {step === 'feedback' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Conte-nos como podemos melhorar sua experiência
              </p>
            </div>

            <Textarea
              placeholder="Seu feedback é muito importante para nós..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
              >
                Pular
              </Button>
              <Button 
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
