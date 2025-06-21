
-- Criar bucket para documentos da base de conhecimento
INSERT INTO storage.buckets (id, name, public) 
VALUES ('knowledge-documents', 'knowledge-documents', true);

-- Política para permitir que usuários autenticados façam upload
CREATE POLICY "Users can upload knowledge documents" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'knowledge-documents');

-- Política para permitir que todos vejam documentos públicos
CREATE POLICY "Everyone can view public knowledge documents" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'knowledge-documents');

-- Política para permitir que autores gerenciem seus documentos
CREATE POLICY "Authors can manage their knowledge documents" 
ON storage.objects 
FOR ALL 
TO authenticated 
USING (bucket_id = 'knowledge-documents' AND owner = auth.uid());

-- Adicionar campo 'context' na tabela knowledge_documents
ALTER TABLE public.knowledge_documents 
ADD COLUMN context TEXT;
