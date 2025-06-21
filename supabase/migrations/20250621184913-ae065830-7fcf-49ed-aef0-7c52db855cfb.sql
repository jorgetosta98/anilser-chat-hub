
-- Corrigir as políticas do storage para permitir upload de logos
DROP POLICY IF EXISTS "Users can upload their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;

-- Criar políticas mais permissivas para o bucket user-logos
CREATE POLICY "Authenticated users can upload logos" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'user-logos');

CREATE POLICY "Authenticated users can update logos" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'user-logos');

CREATE POLICY "Authenticated users can delete logos" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'user-logos');

-- Adicionar políticas RLS para a tabela user_personalization se não existirem
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_personalization' 
        AND policyname = 'Users can view their own personalization'
    ) THEN
        CREATE POLICY "Users can view their own personalization" 
          ON public.user_personalization 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_personalization' 
        AND policyname = 'Users can create their own personalization'
    ) THEN
        CREATE POLICY "Users can create their own personalization" 
          ON public.user_personalization 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_personalization' 
        AND policyname = 'Users can update their own personalization'
    ) THEN
        CREATE POLICY "Users can update their own personalization" 
          ON public.user_personalization 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_personalization' 
        AND policyname = 'Users can delete their own personalization'
    ) THEN
        CREATE POLICY "Users can delete their own personalization" 
          ON public.user_personalization 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END
$$;
