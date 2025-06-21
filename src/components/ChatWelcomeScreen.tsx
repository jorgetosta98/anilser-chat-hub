
import { QuickActionCards } from "./QuickActionCards";
import { FrequentQuestions } from "./FrequentQuestions";

export function ChatWelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Olá, Maria!</h1>
        <p className="text-lg text-gray-600">Como eu poderia te ajudar hoje?</p>
      </div>

      {/* Quick Action Cards */}
      <QuickActionCards />

      {/* Frequent Questions */}
      <FrequentQuestions />
    </div>
  );
}
