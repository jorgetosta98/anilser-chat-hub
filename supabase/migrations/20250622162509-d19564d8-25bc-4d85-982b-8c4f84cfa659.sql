
-- Remove trigger first
DROP TRIGGER IF EXISTS update_whatsapp_connections_updated_at ON public.whatsapp_connections;

-- Remove the trigger function
DROP FUNCTION IF EXISTS public.update_whatsapp_connections_updated_at();

-- Remove all RLS policies
DROP POLICY IF EXISTS "Users can view their own connections" ON public.whatsapp_connections;
DROP POLICY IF EXISTS "Users can create their own connections" ON public.whatsapp_connections;
DROP POLICY IF EXISTS "Users can update their own connections" ON public.whatsapp_connections;
DROP POLICY IF EXISTS "Users can delete their own connections" ON public.whatsapp_connections;

-- Drop the table
DROP TABLE IF EXISTS public.whatsapp_connections;
