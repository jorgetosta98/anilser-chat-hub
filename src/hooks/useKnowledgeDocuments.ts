
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category_id?: string;
  category?: {
    name: string;
    color: string;
  };
  tags: string[];
  file_url?: string;
  file_type?: string;
  is_public: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
}

export function useKnowledgeDocuments() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select(`
          *,
          category:knowledge_categories(name, color)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os documentos.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const searchDocuments = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select(`
          *,
          category:knowledge_categories(name, color)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  };

  const createDocument = async (documentData: Partial<KnowledgeDocument>) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .insert([documentData])
        .select()
        .single();

      if (error) throw error;

      await fetchDocuments(); // Refresh the list
      
      toast({
        title: "Documento criado",
        description: "O documento foi criado com sucesso.",
      });

      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o documento.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDocument = async (id: string, documentData: Partial<KnowledgeDocument>) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .update(documentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchDocuments(); // Refresh the list
      
      toast({
        title: "Documento atualizado",
        description: "O documento foi atualizado com sucesso.",
      });

      return data;
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o documento.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      toast({
        title: "Documento removido",
        description: "O documento foi removido da base de conhecimento.",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o documento.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const incrementViewCount = async (id: string) => {
    try {
      await supabase.rpc('increment_document_views', { document_id: id });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  return {
    documents,
    categories,
    isLoading,
    fetchDocuments,
    fetchCategories,
    searchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    incrementViewCount,
  };
}
