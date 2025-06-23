
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';
import { ChatbotInstructionForm } from './chatbot/ChatbotInstructionForm';
import { ChatbotInstructionActions } from './chatbot/ChatbotInstructionActions';
import { ChatbotInstructionStatus } from './chatbot/ChatbotInstructionStatus';
import { useChatbotInstructionForm } from './chatbot/useChatbotInstructionForm';

export function ChatbotInstructionsSection() {
  const { user } = useAuth();
  const {
    formData,
    isLoading,
    isSaving,
    hasExistingConfig,
    handleInputChange,
    handleSave,
    handleReset,
  } = useChatbotInstructionForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Configurações do Chatbot
          </CardTitle>
          <CardDescription>
            Personalize a personalidade e comportamento do seu assistente virtual.
            {hasExistingConfig && (
              <span className="text-green-600 font-medium ml-2">
                ✓ Configuração ativa encontrada
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ChatbotInstructionForm
            formData={formData}
            onInputChange={handleInputChange}
            user={user}
          />

          <ChatbotInstructionActions
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
            hasExistingConfig={hasExistingConfig}
            user={user}
          />
        </CardContent>
      </Card>

      <ChatbotInstructionStatus hasExistingConfig={hasExistingConfig} />
    </div>
  );
}
