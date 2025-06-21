
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

// Função para expandir consulta com sinônimos e termos relacionados
async function expandSearchQuery(query: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em pesquisa e segurança do trabalho. Dada uma consulta, forneça termos relacionados e sinônimos que podem ajudar na busca.'
          },
          {
            role: 'user',
            content: `Para a consulta "${query}", forneça termos relacionados, sinônimos e variações em português que podem ser úteis na busca por documentos de segurança do trabalho. Responda apenas com as palavras separadas por vírgula, sem explicações.`
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const expandedTerms = data.choices[0].message.content;
    
    return expandedTerms.split(',').map((term: string) => term.trim()).filter((term: string) => term.length > 0);
  } catch (error) {
    console.error('Erro ao expandir consulta:', error);
    return [];
  }
}

// Função para calcular relevância semântica
function calculateSemanticRelevance(document: any, query: string, expandedTerms: string[]): number {
  const queryLower = query.toLowerCase();
  let relevanceScore = 0;

  // Pontuação base por correspondência direta
  if (document.title.toLowerCase().includes(queryLower)) relevanceScore += 5;
  if (document.summary?.toLowerCase().includes(queryLower)) relevanceScore += 3;
  if (document.content.toLowerCase().includes(queryLower)) relevanceScore += 2;

  // Pontuação por tags correspondentes
  document.tags.forEach((tag: string) => {
    if (tag.toLowerCase().includes(queryLower)) relevanceScore += 4;
  });

  // Pontuação por termos expandidos
  expandedTerms.forEach(term => {
    const termLower = term.toLowerCase();
    if (document.title.toLowerCase().includes(termLower)) relevanceScore += 2;
    if (document.summary?.toLowerCase().includes(termLower)) relevanceScore += 1;
    if (document.content.toLowerCase().includes(termLower)) relevanceScore += 0.5;
    
    document.tags.forEach((tag: string) => {
      if (tag.toLowerCase().includes(termLower)) relevanceScore += 2;
    });
  });

  // Bonus por categoria relevante
  if (document.category?.name.toLowerCase().includes(queryLower)) {
    relevanceScore += 3;
  }

  return relevanceScore;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Configurações do Supabase não encontradas');
    }

    // Inicializar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Realizando busca inteligente para: "${query}"`);

    // Expandir consulta com termos relacionados
    const expandedTerms = await expandSearchQuery(query);
    console.log('Termos expandidos:', expandedTerms);

    // Criar consulta SQL mais abrangente
    const searchTerms = [query, ...expandedTerms].slice(0, 10); // Limitar a 10 termos
    const orConditions = searchTerms.map(term => 
      `title.ilike.%${term}%,content.ilike.%${term}%,summary.ilike.%${term}%`
    ).join(',');

    // Buscar documentos
    const { data: documents, error } = await supabase
      .from('knowledge_documents')
      .select(`
        id,
        title,
        content,
        summary,
        tags,
        category:knowledge_categories(name, color)
      `)
      .or(orConditions)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // Calcular relevância semântica e ordenar
    const resultsWithRelevance = (documents || []).map(doc => ({
      ...doc,
      relevanceScore: calculateSemanticRelevance(doc, query, expandedTerms)
    }));

    // Ordenar por relevância e filtrar resultados com score muito baixo
    const sortedResults = resultsWithRelevance
      .filter(result => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    console.log(`✅ Encontrados ${sortedResults.length} resultados relevantes`);

    return new Response(JSON.stringify({ 
      results: sortedResults,
      expandedTerms: expandedTerms,
      totalFound: sortedResults.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erro na função smart-search:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      results: [],
      expandedTerms: [],
      totalFound: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
