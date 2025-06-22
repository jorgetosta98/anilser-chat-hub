
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

import { corsHeaders, supabaseUrl, supabaseServiceKey } from './config.ts';
import { 
  searchNormalKnowledgeBase, 
  searchWhatsAppKnowledgeBase, 
  extractKeywords 
} from './knowledgeBaseService.ts';
import { buildKnowledgeContext, buildSystemPrompt, buildMessages } from './promptService.ts';
import { generateOpenAIResponse } from './openaiService.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, knowledgeBase = 'normal' } = await req.json();

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Configurações do Supabase não encontradas');
    }

    // Inicializar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obter o usuário autenticado do header Authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token de autorização não encontrado');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Erro na autenticação:', authError);
      throw new Error('Usuário não autenticado');
    }

    const userId = user.id;
    console.log('Usuário autenticado:', userId);

    // Extrair palavras-chave da mensagem do usuário
    const keywords = extractKeywords(message);
    console.log('Palavras-chave extraídas:', keywords);
    console.log('Base de conhecimento selecionada:', knowledgeBase);

    // Buscar documentos relevantes baseado na base de conhecimento selecionada
    let foundDocuments = [];
    
    if (keywords.length > 0) {
      if (knowledgeBase === 'whatsapp') {
        // Buscar na base WhatsApp do usuário específico
        foundDocuments = await searchWhatsAppKnowledgeBase(message, supabase, userId);
        
        if (foundDocuments.length > 0) {
          console.log(`✅ Encontradas ${foundDocuments.length} conversas do WhatsApp relevantes para o usuário ${userId}`);
        }
      } else {
        // Buscar na base normal do usuário específico
        foundDocuments = await searchNormalKnowledgeBase(message, supabase, userId);
        
        // Se não encontrar, tentar com palavras-chave separadas
        if (foundDocuments.length === 0) {
          for (const keyword of keywords) {
            const docs = await searchNormalKnowledgeBase(keyword, supabase, userId);
            foundDocuments = [...foundDocuments, ...docs];
            if (foundDocuments.length >= 3) break;
          }
        }
        
        // Remover duplicatas
        foundDocuments = foundDocuments.filter((doc, index, self) => 
          index === self.findIndex(d => d.title === doc.title)
        );
        
        if (foundDocuments.length > 0) {
          console.log(`✅ Encontrados ${foundDocuments.length} documentos relevantes para o usuário ${userId}`);
        }
      }
      
      if (foundDocuments.length === 0) {
        console.log(`❌ Nenhum documento relevante foi encontrado na base ${knowledgeBase} para o usuário ${userId}`);
      }
    }

    // Construir contexto e prompt
    const knowledgeContext = buildKnowledgeContext(foundDocuments, knowledgeBase);
    const systemPrompt = buildSystemPrompt(knowledgeBase, knowledgeContext, foundDocuments);
    const messages = buildMessages(systemPrompt, conversationHistory, message);

    console.log(`Enviando para OpenAI com contexto da base ${knowledgeBase} do usuário ${userId}...`);

    // Gerar resposta da OpenAI
    const aiResponse = await generateOpenAIResponse(messages);

    console.log('✅ Resposta gerada com sucesso para o usuário', userId);

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
