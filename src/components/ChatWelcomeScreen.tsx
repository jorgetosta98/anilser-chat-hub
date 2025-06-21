
import { FrequentQuestions } from "./FrequentQuestions";
import { useAuth } from "@/contexts/AuthContext";

export function ChatWelcomeScreen() {
  const { profile } = useAuth();
  
  // Usar o nome da empresa se disponível, senão usar "SafeBoy" como fallback
  const welcomeName = profile?.company || "SafeBoy";
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Olá, {welcomeName}!</h1>
        <p className="text-xl text-gray-600 mb-8">Como eu poderia te ajudar hoje?</p>
      </div>

      {/* Frequent Questions */}
      <FrequentQuestions />
    </div>
  );
}
