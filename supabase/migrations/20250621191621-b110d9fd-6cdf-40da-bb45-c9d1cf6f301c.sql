
-- Criar tabela para armazenar avaliações de conversas
CREATE TABLE public.conversation_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.conversation_ratings ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam suas próprias avaliações
CREATE POLICY "Users can view their own ratings" 
  ON public.conversation_ratings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários criem suas próprias avaliações
CREATE POLICY "Users can create their own ratings" 
  ON public.conversation_ratings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Adicionar coluna para rastrear tags utilizadas nas mensagens
ALTER TABLE public.messages 
ADD COLUMN used_tags TEXT[] DEFAULT '{}';

-- Índices para melhor performance
CREATE INDEX idx_conversation_ratings_user_id ON public.conversation_ratings(user_id);
CREATE INDEX idx_conversation_ratings_conversation_id ON public.conversation_ratings(conversation_id);
CREATE INDEX idx_messages_used_tags ON public.messages USING GIN (used_tags);
