
-- Criar tabela para instruções personalizadas do chatbot por empresa/usuário
CREATE TABLE public.chatbot_instructions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instructions TEXT NOT NULL,
  persona_name TEXT DEFAULT 'SafeBoy',
  persona_description TEXT,
  additional_context TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela
ALTER TABLE public.chatbot_instructions ENABLE ROW LEVEL SECURITY;

-- Política para que usuários vejam apenas suas próprias instruções
CREATE POLICY "Users can view their own chatbot instructions" 
  ON public.chatbot_instructions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para que usuários criem suas próprias instruções
CREATE POLICY "Users can create their own chatbot instructions" 
  ON public.chatbot_instructions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para que usuários atualizem suas próprias instruções
CREATE POLICY "Users can update their own chatbot instructions" 
  ON public.chatbot_instructions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para que usuários deletem suas próprias instruções
CREATE POLICY "Users can delete their own chatbot instructions" 
  ON public.chatbot_instructions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_chatbot_instructions_updated_at
    BEFORE UPDATE ON public.chatbot_instructions
    FOR EACH ROW
    EXECUTE FUNCTION update_knowledge_updated_at();

-- Criar índice para performance
CREATE INDEX idx_chatbot_instructions_user_id ON public.chatbot_instructions(user_id);
CREATE INDEX idx_chatbot_instructions_active ON public.chatbot_instructions(user_id, is_active);
