
-- Atualizar a constraint do status na tabela whatsapp_connections para incluir os novos status
ALTER TABLE public.whatsapp_connections 
DROP CONSTRAINT IF EXISTS whatsapp_connections_status_check;

ALTER TABLE public.whatsapp_connections 
ADD CONSTRAINT whatsapp_connections_status_check 
CHECK (status IN ('pending', 'connected', 'disconnected', 'error', 'conectando', 'desconectado'));
