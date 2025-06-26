
-- Remove as tabelas de mensagens e conversas do WhatsApp
DROP TABLE IF EXISTS public.whatsapp_messages CASCADE;
DROP TABLE IF EXISTS public.whatsapp_conversations CASCADE;

-- Remove as funções relacionadas
DROP FUNCTION IF EXISTS public.update_whatsapp_messages_updated_at() CASCADE;
