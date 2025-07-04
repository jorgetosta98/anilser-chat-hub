
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  user_id: string;
  created_at: string;
  updated_at: string;
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

export function useKnowledgeDocumentOperations() {
  const { toast } = useToast();
  const { user } = useAuth();

  const searchDocuments = async (query: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select(`
          *,
          category:knowledge_categories(name, color)
        `)
        .eq('user_id', user.id)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  };

  const createDocument = async (documentData: CreateDocumentData) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar documentos.",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }

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
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
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

  return {
    searchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    incrementViewCount,
  };
}
