
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para buscar documentos relevantes na base de conhecimento
async function searchKnowledgeBase(query: string, supabase: any) {
  try {
    const { data, error } = await supabase
      .from('knowledge_documents')
      .select(`
        title,
        content,
        summary,
        category:knowledge_categories(name)
      `)
      .eq('is_public', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
      .limit(5);

    if (error) {
      console.error('Erro ao buscar na base de conhecimento:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro na busca da base de conhecimento:', error);
    return [];
  }
}

// Função para extrair palavras-chave da mensagem do usuário
function extractKeywords(message: string): string[] {
  const stopWords = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'como', 'que', 'qual', 'quais', 'é', 'são', 'me', 'te', 'se', 'nos', 'vos'];
  return message
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5); // Pegar até 5 palavras-chave
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Configurações do Supabase não encontradas');
    }

    // Inicializar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extrair palavras-chave da mensagem do usuário
    const keywords = extractKeywords(message);
    console.log('Palavras-chave extraídas:', keywords);

    // Buscar documentos relevantes na base de conhecimento
    let knowledgeContext = '';
    if (keywords.length > 0) {
      const searchQuery = keywords.join(' ');
      const relevantDocs = await searchKnowledgeBase(searchQuery, supabase);
      
      if (relevantDocs.length > 0) {
        knowledgeContext = '\n\nINFORMAÇÕES DA BASE DE CONHECIMENTO DA EMPRESA:\n';
        relevantDocs.forEach((doc, index) => {
          knowledgeContext += `\n--- Documento ${index + 1}: ${doc.title} ---\n`;
          if (doc.category?.name) {
            knowledgeContext += `Categoria: ${doc.category.name}\n`;
          }
          if (doc.summary) {
            knowledgeContext += `Resumo: ${doc.summary}\n`;
          }
          knowledgeContext += `Conteúdo: ${doc.content.substring(0, 500)}${doc.content.length > 500 ? '...' : ''}\n`;
        });
        knowledgeContext += '\n--- Fim das informações da base de conhecimento ---\n';
        
        console.log(`Encontrados ${relevantDocs.length} documentos relevantes na base de conhecimento`);
      }
    }

    // Construir histórico da conversa para contexto
    const systemPrompt = `Você é o SafeBoy, um assistente virtual especializado em segurança do trabalho e saúde ocupacional. 
    
    Suas características:
    - Responda sempre em português brasileiro
    - Seja preciso e técnico quando necessário
    - Cite normas regulamentadoras (NRs) quando relevante
    - Seja prestativo e educativo
    - Mantenha um tom profissional mas acessível
    - Se a pergunta não for relacionada à segurança do trabalho, redirecione educadamente para o tema
    
    IMPORTANTE: Você tem acesso à base de conhecimento específica da empresa do cliente. 
    Use SEMPRE essas informações como fonte principal para suas respostas, pois elas contêm:
    - Procedimentos específicos da empresa
    - Políticas internas de segurança
    - Documentação técnica personalizada
    - Normas e regulamentações aplicáveis ao contexto da empresa
    
    Quando responder:
    1. Priorize as informações da base de conhecimento da empresa
    2. Complemente com conhecimento geral sobre segurança do trabalho quando necessário
    3. Sempre mencione quando está usando informações específicas da empresa
    4. Se não encontrar informações específicas na base de conhecimento, use seu conhecimento geral mas deixe isso claro
    
    ${knowledgeContext}`;

    const messages = [
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função chat-ai:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackResponse: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
