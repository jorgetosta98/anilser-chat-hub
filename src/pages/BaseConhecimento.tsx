
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentFormModal } from "@/components/client/modals/DocumentFormModal";
import { KnowledgePageHeader } from "@/components/knowledge/KnowledgePageHeader";
import { KnowledgeFilters } from "@/components/knowledge/KnowledgeFilters";
import { DocumentList } from "@/components/knowledge/DocumentList";
import { supabase } from "@/integrations/supabase/client";

interface KnowledgeDocument {
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

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function BaseConhecimento() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
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
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os documentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
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
    }
  };

  const handleSaveDocument = async () => {
    await fetchDocuments();
    setEditingDocument(null);
  };

  const openCreateModal = () => {
    setEditingDocument(null);
    setIsDocumentModalOpen(true);
  };

  const openEditModal = (document: KnowledgeDocument) => {
    setEditingDocument(document);
    setIsDocumentModalOpen(true);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <KnowledgePageHeader onCreateDocument={openCreateModal} />

        <KnowledgeFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        <DocumentList
          documents={documents}
          isLoading={isLoading}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onEditDocument={openEditModal}
          onDeleteDocument={handleDeleteDocument}
        />

        <DocumentFormModal
          isOpen={isDocumentModalOpen}
          onClose={() => setIsDocumentModalOpen(false)}
          document={editingDocument}
          onSave={handleSaveDocument}
        />
      </div>
    </div>
  );
}
