
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

// Type for document creation - requires only essential fields
interface CreateDocumentData {
  title: string;
  content: string;
  summary?: string;
  category_id?: string;
  tags?: string[];
  file_url?: string;
  file_type?: string;
  is_public?: boolean;
}

// Type for document updates - all fields optional except id
interface UpdateDocumentData {
  title?: string;
  content?: string;
  summary?: string;
  category_id?: string;
  tags?: string[];
  file_url?: string;
  file_type?: string;
  is_public?: boolean;
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

  const createDocument = async (documentData: CreateDocumentData) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .insert([{
          title: documentData.title,
          content: documentData.content,
          summary: documentData.summary || null,
          category_id: documentData.category_id || null,
          tags: documentData.tags || [],
          file_url: documentData.file_url || null,
          file_type: documentData.file_type || null,
          is_public: documentData.is_public ?? true,
        }])
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

  const updateDocument = async (id: string, documentData: UpdateDocumentData) => {
    try {
      const updateData: any = {};
      
      if (documentData.title !== undefined) updateData.title = documentData.title;
      if (documentData.content !== undefined) updateData.content = documentData.content;
      if (documentData.summary !== undefined) updateData.summary = documentData.summary;
      if (documentData.category_id !== undefined) updateData.category_id = documentData.category_id;
      if (documentData.tags !== undefined) updateData.tags = documentData.tags;
      if (documentData.file_url !== undefined) updateData.file_url = documentData.file_url;
      if (documentData.file_type !== undefined) updateData.file_type = documentData.file_type;
      if (documentData.is_public !== undefined) updateData.is_public = documentData.is_public;

      const { data, error } = await supabase
        .from('knowledge_documents')
        .update(updateData)
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
      // Since increment_document_views RPC doesn't exist, we'll update manually
      const { data: currentDoc, error: fetchError } = await supabase
        .from('knowledge_documents')
        .select('views_count')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('knowledge_documents')
        .update({ views_count: (currentDoc.views_count || 0) + 1 })
        .eq('id', id);

      if (updateError) throw updateError;
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
