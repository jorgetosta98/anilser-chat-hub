
-- Criar tabela para categorias da base de conhecimento
CREATE TABLE public.knowledge_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para documentos da base de conhecimento
CREATE TABLE public.knowledge_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category_id UUID REFERENCES public.knowledge_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  file_url TEXT,
  file_type TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_knowledge_documents_category ON public.knowledge_documents(category_id);
CREATE INDEX idx_knowledge_documents_tags ON public.knowledge_documents USING GIN(tags);
CREATE INDEX idx_knowledge_documents_search ON public.knowledge_documents USING GIN(to_tsvector('portuguese', title || ' ' || content));

-- Habilitar RLS nas tabelas
ALTER TABLE public.knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias (todos podem ver, apenas admins podem modificar)
CREATE POLICY "Everyone can view categories" 
  ON public.knowledge_categories 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Only admins can modify categories" 
  ON public.knowledge_categories 
  FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Políticas para documentos
CREATE POLICY "Everyone can view public documents" 
  ON public.knowledge_documents 
  FOR SELECT 
  TO authenticated 
  USING (is_public = true OR author_id = auth.uid());

CREATE POLICY "Authors can manage their documents" 
  ON public.knowledge_documents 
  FOR ALL 
  TO authenticated 
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all documents" 
  ON public.knowledge_documents 
  FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Inserir categorias padrão
INSERT INTO public.knowledge_categories (name, description, icon, color) VALUES
('Normas Regulamentadoras', 'Documentos e informações sobre NRs', 'FileText', '#EF4444'),
('EPIs e EPCs', 'Equipamentos de Proteção Individual e Coletiva', 'Shield', '#10B981'),
('Procedimentos', 'Procedimentos operacionais padrão', 'ClipboardList', '#F59E0B'),
('Treinamentos', 'Materiais de treinamento e capacitação', 'GraduationCap', '#8B5CF6'),
('Legislação', 'Leis e regulamentações trabalhistas', 'Scale', '#6366F1'),
('Relatórios', 'Modelos e exemplos de relatórios', 'BarChart3', '#EC4899');

-- Função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_knowledge_categories_updated_at
    BEFORE UPDATE ON public.knowledge_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_knowledge_updated_at();

CREATE TRIGGER update_knowledge_documents_updated_at
    BEFORE UPDATE ON public.knowledge_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_knowledge_updated_at();
