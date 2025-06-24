
-- Criar tabela para armazenar mensagens do WhatsApp
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID REFERENCES public.whatsapp_connections(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  message_id TEXT NOT NULL, -- ID único da mensagem no WhatsApp
  from_number TEXT NOT NULL, -- Número de quem enviou
  to_number TEXT NOT NULL, -- Número de quem recebeu
  message_type TEXT NOT NULL DEFAULT 'text', -- tipo: text, image, audio, video, document
  content TEXT, -- Conteúdo da mensagem (texto)
  media_url TEXT, -- URL do arquivo de mídia (se houver)
  media_mimetype TEXT, -- Tipo MIME do arquivo de mídia
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL, -- Quando a mensagem foi enviada
  is_from_me BOOLEAN NOT NULL DEFAULT false, -- Se a mensagem foi enviada por mim ou recebida
  status TEXT DEFAULT 'received', -- Status: received, sent, delivered, read, failed
  metadata JSONB DEFAULT '{}', -- Dados adicionais da mensagem
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhorar performance
CREATE INDEX idx_whatsapp_messages_connection_id ON public.whatsapp_messages(connection_id);
CREATE INDEX idx_whatsapp_messages_user_id ON public.whatsapp_messages(user_id);
CREATE INDEX idx_whatsapp_messages_timestamp ON public.whatsapp_messages(timestamp DESC);
CREATE INDEX idx_whatsapp_messages_from_number ON public.whatsapp_messages(from_number);
CREATE INDEX idx_whatsapp_messages_message_id ON public.whatsapp_messages(message_id);

-- Criar índice único para evitar mensagens duplicadas
CREATE UNIQUE INDEX idx_whatsapp_messages_unique ON public.whatsapp_messages(connection_id, message_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para que usuários vejam apenas suas próprias mensagens
CREATE POLICY "Users can view their own WhatsApp messages" 
  ON public.whatsapp_messages 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own WhatsApp messages" 
  ON public.whatsapp_messages 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own WhatsApp messages" 
  ON public.whatsapp_messages 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own WhatsApp messages" 
  ON public.whatsapp_messages 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_whatsapp_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_whatsapp_messages_updated_at
    BEFORE UPDATE ON public.whatsapp_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_whatsapp_messages_updated_at();

-- Criar tabela para conversas do WhatsApp (agrupamento de mensagens)
CREATE TABLE public.whatsapp_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID REFERENCES public.whatsapp_connections(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  participant_number TEXT NOT NULL, -- Número do participante da conversa
  participant_name TEXT, -- Nome do contato (se disponível)
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para conversas
CREATE INDEX idx_whatsapp_conversations_connection_id ON public.whatsapp_conversations(connection_id);
CREATE INDEX idx_whatsapp_conversations_user_id ON public.whatsapp_conversations(user_id);
CREATE INDEX idx_whatsapp_conversations_participant ON public.whatsapp_conversations(participant_number);
CREATE INDEX idx_whatsapp_conversations_last_message ON public.whatsapp_conversations(last_message_at DESC);

-- Índice único para evitar conversas duplicadas
CREATE UNIQUE INDEX idx_whatsapp_conversations_unique ON public.whatsapp_conversations(connection_id, participant_number);

-- Habilitar RLS para conversas
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para conversas
CREATE POLICY "Users can view their own WhatsApp conversations" 
  ON public.whatsapp_conversations 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own WhatsApp conversations" 
  ON public.whatsapp_conversations 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own WhatsApp conversations" 
  ON public.whatsapp_conversations 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own WhatsApp conversations" 
  ON public.whatsapp_conversations 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Trigger para atualizar updated_at das conversas
CREATE TRIGGER update_whatsapp_conversations_updated_at
    BEFORE UPDATE ON public.whatsapp_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_whatsapp_messages_updated_at();
