
-- Primeiro, vamos habilitar RLS nas tabelas que ainda não têm
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view their own knowledge documents" ON public.knowledge_documents;
DROP POLICY IF EXISTS "Users can create their own knowledge documents" ON public.knowledge_documents;
DROP POLICY IF EXISTS "Users can update their own knowledge documents" ON public.knowledge_documents;
DROP POLICY IF EXISTS "Users can delete their own knowledge documents" ON public.knowledge_documents;

-- Criar novas políticas RLS mais específicas para knowledge_documents
CREATE POLICY "Users can view their own knowledge documents" 
  ON public.knowledge_documents 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own knowledge documents" 
  ON public.knowledge_documents 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge documents" 
  ON public.knowledge_documents 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge documents" 
  ON public.knowledge_documents 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Garantir que user_frequent_questions também tenha RLS habilitado
ALTER TABLE public.user_frequent_questions ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view their own frequent questions" ON public.user_frequent_questions;
DROP POLICY IF EXISTS "Users can create their own frequent questions" ON public.user_frequent_questions;
DROP POLICY IF EXISTS "Users can update their own frequent questions" ON public.user_frequent_questions;
DROP POLICY IF EXISTS "Users can delete their own frequent questions" ON public.user_frequent_questions;

-- Criar políticas RLS para user_frequent_questions
CREATE POLICY "Users can view their own frequent questions" 
  ON public.user_frequent_questions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own frequent questions" 
  ON public.user_frequent_questions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own frequent questions" 
  ON public.user_frequent_questions 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own frequent questions" 
  ON public.user_frequent_questions 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);
