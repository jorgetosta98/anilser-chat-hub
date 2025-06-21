
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
    // Busca mais ampla usando diferentes estratégias
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
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
      .limit(3);

    if (error) {
      console.error('Erro ao buscar na base de conhecimento:', error);
      return [];
    }

    console.log(`Busca por "${query}" encontrou ${data?.length || 0} documentos`);
    return data || [];
  } catch (error) {
    console.error('Erro na busca da base de conhecimento:', error);
    return [];
  }
}

// Função para extrair palavras-chave da mensagem do usuário
function extractKeywords(message: string): string[] {
  const stopWords = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'como', 'que', 'qual', 'quais', 'é', 'são', 'me', 'te', 'se', 'nos', 'vos', 'sobre', 'isso', 'essa', 'este', 'esta'];
  
  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove pontuação
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
    
  console.log('Palavras extraídas:', words);
  return words.slice(0, 5); // Pegar até 5 palavras-chave
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
    let foundDocuments = [];
    
    if (keywords.length > 0) {
      // Tentar busca com a frase completa primeiro
      foundDocuments = await searchKnowledgeBase(message, supabase);
      
      // Se não encontrar, tentar com palavras-chave separadas
      if (foundDocuments.length === 0) {
        for (const keyword of keywords) {
          const docs = await searchKnowledgeBase(keyword, supabase);
          foundDocuments = [...foundDocuments, ...docs];
          if (foundDocuments.length >= 3) break; // Limitar a 3 documentos
        }
      }
      
      // Remover duplicatas
      foundDocuments = foundDocuments.filter((doc, index, self) => 
        index === self.findIndex(d => d.title === doc.title)
      );
      
      if (foundDocuments.length > 0) {
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
        
        console.log(`✅ Encontrados ${foundDocuments.length} documentos relevantes para incluir no contexto`);
      } else {
        console.log('❌ Nenhum documento relevante foi encontrado na base de conhecimento');
      }
    }

    // Construir o prompt do sistema com instruções mais claras
    const systemPrompt = `Você é o SafeBoy, um assistente virtual especializado em segurança do trabalho e saúde ocupacional. 

    INSTRUÇÕES IMPORTANTES:
    - Responda SEMPRE em português brasileiro
    - Seja preciso e técnico quando necessário
    - Cite normas regulamentadoras (NRs) quando relevante
    - Seja prestativo e educativo
    - Mantenha um tom profissional mas acessível
    
    SOBRE A BASE DE CONHECIMENTO:
    - Você tem acesso à base de conhecimento específica da empresa do cliente
    - SEMPRE priorize as informações da base de conhecimento da empresa em suas respostas
    - Quando usar informações da base de conhecimento, mencione que são "informações específicas da empresa"
    - Se encontrar informações relevantes na base de conhecimento, use-as como fonte principal
    - Complemente com conhecimento geral apenas quando necessário
    
    ${knowledgeContext}
    
    ${foundDocuments.length > 0 ? 
      'IMPORTANTE: Use as informações acima da base de conhecimento para responder à pergunta do usuário. Essas são informações específicas da empresa e devem ter prioridade na sua resposta.' : 
      'Não foram encontradas informações específicas na base de conhecimento para esta pergunta. Responda com seu conhecimento geral sobre segurança do trabalho.'
    }`;

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

    console.log('Enviando para OpenAI com contexto da base de conhecimento...');

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

    console.log('✅ Resposta gerada com sucesso');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erro na função chat-ai:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackResponse: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
