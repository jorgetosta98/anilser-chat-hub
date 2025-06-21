
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

// Função para extrair texto de diferentes tipos de arquivo
async function extractTextFromFile(fileData: string, fileType: string, fileName: string) {
  try {
    // Para PDFs e documentos mais complexos, usaríamos uma biblioteca específica
    // Por enquanto, vamos simular a extração de texto
    if (fileType.includes('text/plain')) {
      // Para arquivos de texto, decodificar diretamente
      const base64Data = fileData.split(',')[1];
      const textContent = atob(base64Data);
      return textContent;
    }
    
    // Para outros tipos, retornar uma mensagem indicando que o processamento seria feito
    return `Documento: ${fileName}\nTipo: ${fileType}\nConteúdo será processado automaticamente.`;
  } catch (error) {
    console.error('Erro ao extrair texto:', error);
    return `Erro ao processar o arquivo ${fileName}`;
  }
}

// Função para buscar categorias existentes
async function getExistingCategories(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('knowledge_categories')
      .select('name')
      .order('name');

    if (error) throw error;
    return data?.map(cat => cat.name) || [];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, fileName, fileType } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Configurações do Supabase não encontradas');
    }

    // Inicializar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extrair texto do arquivo
    const extractedText = await extractTextFromFile(file, fileType, fileName);
    
    // Buscar categorias existentes
    const existingCategories = await getExistingCategories(supabase);
    const categoriesText = existingCategories.length > 0 
      ? `Categorias disponíveis: ${existingCategories.join(', ')}`
      : 'Nenhuma categoria disponível.';

    // Analisar documento com OpenAI
    const analysisPrompt = `
    Analise o seguinte documento e forneça as informações solicitadas:

    DOCUMENTO:
    Nome: ${fileName}
    Tipo: ${fileType}
    Conteúdo: ${extractedText}

    ${categoriesText}

    Por favor, forneça uma análise estruturada em JSON com:
    1. Um resumo conciso (máximo 200 caracteres)
    2. Tags relevantes (máximo 5 tags)
    3. Categoria sugerida (use uma das existentes se apropriado, ou sugira uma nova)
    4. Tópicos principais identificados (máximo 3)

    Responda apenas com um JSON válido no seguinte formato:
    {
      "suggestedSummary": "resumo do documento",
      "suggestedTags": ["tag1", "tag2", "tag3"],
      "suggestedCategory": "categoria sugerida",
      "keyTopics": ["tópico1", "tópico2", "tópico3"]
    }
    `;

    console.log('Enviando para análise OpenAI...');

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
            content: 'Você é um especialista em análise de documentos. Responda sempre com JSON válido conforme solicitado.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse da resposta JSON
    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Erro ao parsear resposta da IA:', parseError);
      // Fallback para resposta padrão
      analysisResult = {
        suggestedSummary: `Documento: ${fileName}`,
        suggestedTags: ['documento'],
        suggestedCategory: 'Geral',
        keyTopics: ['conteúdo', 'informação']
      };
    }

    const result = {
      extractedText: extractedText.substring(0, 5000), // Limitar tamanho
      suggestedSummary: analysisResult.suggestedSummary || '',
      suggestedTags: analysisResult.suggestedTags || [],
      suggestedCategory: analysisResult.suggestedCategory || 'Geral',
      keyTopics: analysisResult.keyTopics || []
    };

    console.log('✅ Análise concluída com sucesso');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Erro na função analyze-document:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      extractedText: '',
      suggestedSummary: 'Erro na análise automática',
      suggestedTags: [],
      suggestedCategory: 'Geral',
      keyTopics: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
