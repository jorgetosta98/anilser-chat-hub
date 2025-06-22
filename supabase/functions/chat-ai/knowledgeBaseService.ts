
// Função para buscar documentos relevantes na base de conhecimento normal (filtrado por usuário)
export async function searchNormalKnowledgeBase(query: string, supabase: any, userId: string) {
  try {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    const { data, error } = await supabase
      .from('knowledge_documents')
      .select(`
        title,
        content,
        summary,
        category:knowledge_categories(name)
      `)
      .eq('user_id', userId) // FILTRO CRUCIAL: apenas documentos do usuário
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
      .limit(3);

    if (error) {
      console.error('Erro ao buscar na base de conhecimento normal:', error);
      return [];
    }

    console.log(`Busca normal por "${query}" para usuário ${userId} encontrou ${data?.length || 0} documentos`);
    return data || [];
  } catch (error) {
    console.error('Erro na busca da base de conhecimento normal:', error);
    return [];
  }
}

// Função para buscar conversas do WhatsApp relevantes (filtrado por usuário)
export async function searchWhatsAppKnowledgeBase(query: string, supabase: any, userId: string) {
  try {
    // Buscar conversas do usuário específico
    const { data, error } = await supabase
      .from('messages')
      .select(`
        content,
        created_at,
        conversation_id,
        conversations!inner(user_id)
      `)
      .ilike('content', `%${query}%`)
      .eq('is_user', false) // Apenas respostas da IA/assistente
      .eq('conversations.user_id', userId) // FILTRO CRUCIAL: apenas conversas do usuário
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erro ao buscar na base WhatsApp:', error);
      return [];
    }

    console.log(`Busca WhatsApp por "${query}" para usuário ${userId} encontrou ${data?.length || 0} conversas`);
    return data || [];
  } catch (error) {
    console.error('Erro na busca da base WhatsApp:', error);
    return [];
  }
}

// Função para extrair palavras-chave da mensagem do usuário
export function extractKeywords(message: string): string[] {
  const stopWords = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'como', 'que', 'qual', 'quais', 'é', 'são', 'me', 'te', 'se', 'nos', 'vos', 'sobre', 'isso', 'essa', 'este', 'esta'];
  
  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove pontuação
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
    
  console.log('Palavras extraídas:', words);
  return words.slice(0, 5); // Pegar até 5 palavras-chave
}
