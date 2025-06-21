
import { FrequentQuestions } from "./FrequentQuestions";

export function ChatWelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Olá, SafeBoy!</h1>
        <p className="text-xl text-gray-600 mb-8">Como eu poderia te ajudar hoje?</p>
      </div>

      {/* Frequent Questions */}
      <FrequentQuestions />
    </div>
  );
}
