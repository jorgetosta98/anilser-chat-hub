
import { useAuth } from '@/contexts/AuthContext';

export class ChatbotSuggestionsService {
  static getSuggestedChatbotName(profile?: any, user?: any): string {
    // Pegar o nome da empresa do perfil ou dos metadados do usuário
    const companyName = profile?.company || user?.user_metadata?.company;
    
    if (companyName) {
      // Se há nome da empresa, usar como "Assistente [Nome da Empresa]"
      return `Assistente ${companyName}`;
    }
    
    // Caso contrário, usar nome genérico
    return 'Assistente Virtual';
  }

  static getSuggestedDescription(profile?: any, user?: any): string {
    const companyName = profile?.company || user?.user_metadata?.company;
    
    if (companyName) {
      return `Assistente virtual da ${companyName}`;
    }
    
    return '';
  }
}

export function useChatbotSuggestions() {
  const { profile, user } = useAuth();

  const getSuggestedName = () => {
    return ChatbotSuggestionsService.getSuggestedChatbotName(profile, user);
  };

  const getSuggestedDescription = () => {
    return ChatbotSuggestionsService.getSuggestedDescription(profile, user);
  };

  return {
    getSuggestedName,
    getSuggestedDescription,
  };
}
