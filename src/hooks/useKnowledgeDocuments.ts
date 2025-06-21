
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeCategories } from './useKnowledgeCategories';
import { useKnowledgeDocumentOperations, type KnowledgeDocument } from './useKnowledgeDocumentOperations';

// Re-export types for backward compatibility
export type { KnowledgeDocument } from './useKnowledgeDocumentOperations';
export type { Category } from './useKnowledgeCategories';

export function useKnowledgeDocuments() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Use the focused hooks
  const { categories, fetchCategories } = useKnowledgeCategories();
  const operations = useKnowledgeDocumentOperations();

  const fetchDocuments = async () => {
    if (!user) {
      setDocuments([]);
      setIsLoading(false);
      return [];
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select(`
          *,
          category:knowledge_categories(name, color)
        `)
        .eq('user_id', user.id)
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

  // Enhanced delete function that also updates local state
  const deleteDocument = async (id: string) => {
    await operations.deleteDocument(id);
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Enhanced create function that refreshes the list
  const createDocument = async (documentData: Parameters<typeof operations.createDocument>[0]) => {
    const result = await operations.createDocument(documentData);
    await fetchDocuments(); // Refresh the list
    return result;
  };

  // Enhanced update function that refreshes the list
  const updateDocument = async (id: string, documentData: Parameters<typeof operations.updateDocument>[1]) => {
    const result = await operations.updateDocument(id, documentData);
    await fetchDocuments(); // Refresh the list
    return result;
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  return {
    documents,
    categories,
    isLoading,
    fetchDocuments,
    fetchCategories,
    searchDocuments: operations.searchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    incrementViewCount: operations.incrementViewCount,
  };
}
