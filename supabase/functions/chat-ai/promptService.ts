export function buildKnowledgeContext(foundDocuments: any[], knowledgeBase: string): string {
  if (foundDocuments.length === 0) return '';

  let knowledgeContext = '';
  
  if (knowledgeBase === 'whatsapp') {
    knowledgeContext = '\n\n=== INFORMAÇÕES DAS CONVERSAS DO WHATSAPP ===\n';
    knowledgeContext += `Encontrei ${foundDocuments.length} conversa(s) relevante(s) do WhatsApp:\n\n`;
    
    foundDocuments.forEach((doc, index) => {
      knowledgeContext += `--- CONVERSA ${index + 1} ---\n`;
      knowledgeContext += `Data: ${new Date(doc.created_at).toLocaleString('pt-BR')}\n`;
      knowledgeContext += `Conteúdo: ${doc.content}\n\n`;
    });
    
    knowledgeContext += '=== FIM DAS INFORMAÇÕES DO WHATSAPP ===\n\n';
  } else {
    knowledgeContext = '\n\n=== INFORMAÇÕES DA BASE DE CONHECIMENTO DA EMPRESA ===\n';
    knowledgeContext += `Encontrei ${foundDocuments.length} documento(s) relevante(s) na base de conhecimento:\n\n`;
    
    foundDocuments.forEach((doc, index) => {
      knowledgeContext += `--- DOCUMENTO ${index + 1}: ${doc.title} ---\n`;
      if (doc.category?.name) {
        knowledgeContext += `Categoria: ${doc.category.name}\n`;
      }
      if (doc.summary) {
        knowledgeContext += `Resumo: ${doc.summary}\n`;
      }
      knowledgeContext += `Conteúdo: ${doc.content}\n\n`;
    });
    
    knowledgeContext += '=== FIM DAS INFORMAÇÕES DA BASE DE CONHECIMENTO ===\n\n';
  }

  return knowledgeContext;
}

export function buildSystemPrompt(knowledgeBase: string, knowledgeContext: string, foundDocuments: any[], personalizedInstructions: any = null): string {
  let systemPrompt = '';
  
  // Use personalized instructions if available
  if (personalizedInstructions) {
    systemPrompt = `Você é ${personalizedInstructions.persona_name}, um assistente virtual especializado em segurança do trabalho e saúde ocupacional.`;
    
    if (personalizedInstructions.persona_description) {
      systemPrompt += `\n\nSUA PERSONALIDADE: ${personalizedInstructions.persona_description}`;
    }
    
    systemPrompt += `\n\nINSTRUÇÕES PERSONALIZADAS:\n${personalizedInstructions.instructions}`;
    
    if (personalizedInstructions.additional_context) {
      systemPrompt += `\n\nCONTEXTO ADICIONAL DA EMPRESA:\n${personalizedInstructions.additional_context}`;
    }
  } else {
    // Default instructions if no personalized ones are found
    systemPrompt = `Você é o SafeBoy, um assistente virtual especializado em segurança do trabalho e saúde ocupacional.`;
  }

  systemPrompt += `

INSTRUÇÕES IMPORTANTES:
- Responda SEMPRE em português brasileiro
- Seja preciso e técnico quando necessário
- Cite normas regulamentadoras (NRs) quando relevante
- Seja prestativo e educativo
- Mantenha um tom profissional mas acessível`;

  if (knowledgeBase === 'whatsapp') {
    systemPrompt += `

SOBRE AS CONVERSAS DO WHATSAPP:
- Você tem acesso ao histórico de conversas do WhatsApp da empresa
- SEMPRE priorize as informações das conversas do WhatsApp em suas respostas
- Quando usar informações das conversas, mencione que são "informações do histórico WhatsApp"
- Use o contexto das conversas anteriores para dar respostas mais personalizadas
- Complemente com conhecimento geral apenas quando necessário`;
  } else {
    systemPrompt += `

SOBRE A BASE DE CONHECIMENTO:
- Você tem acesso à base de conhecimento específica da empresa do cliente
- SEMPRE priorize as informações da base de conhecimento da empresa em suas respostas
- Quando usar informações da base de conhecimento, mencione que são "informações específicas da empresa"
- Se encontrar informações relevantes na base de conhecimento, use-as como fonte principal
- Complemente com conhecimento geral apenas quando necessário`;
  }

  systemPrompt += `

${knowledgeContext}

${foundDocuments.length > 0 ? 
    (knowledgeBase === 'whatsapp' ? 
      'IMPORTANTE: Use as informações acima das conversas do WhatsApp para responder à pergunta do usuário. Essas são conversas reais da empresa e devem ter prioridade na sua resposta.' :
      'IMPORTANTE: Use as informações acima da base de conhecimento para responder à pergunta do usuário. Essas são informações específicas da empresa e devem ter prioridade na sua resposta.'
    ) : 
    `Não foram encontradas informações específicas na base ${knowledgeBase === 'whatsapp' ? 'WhatsApp' : 'de conhecimento'} para esta pergunta. Responda com seu conhecimento geral sobre segurança do trabalho.`
  }`;

  return systemPrompt;
}

export function buildMessages(systemPrompt: string, conversationHistory: any[], message: string) {
  return [
    {
      role: 'system',
      content: systemPrompt
    },
    ...conversationHistory.map((msg: any) => ({
      role: msg.is_user ? 'user' : 'assistant',
      content: msg.content
    })),
    { role: 'user', content: message }
  ];
}
