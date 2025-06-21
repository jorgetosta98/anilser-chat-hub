
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentFormModal } from "@/components/client/modals/DocumentFormModal";
import { KnowledgePageHeader } from "@/components/knowledge/KnowledgePageHeader";
import { KnowledgeFilters } from "@/components/knowledge/KnowledgeFilters";
import { DocumentList } from "@/components/knowledge/DocumentList";
import { IntelligentSearchPanel } from "@/components/knowledge/IntelligentSearchPanel";
import { useKnowledgeDocuments } from "@/hooks/useKnowledgeDocuments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, List } from "lucide-react";

export default function BaseConhecimento() {
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  // Use the refactored hook that now handles user-specific data
  const {
    documents,
    categories,
    isLoading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  } = useKnowledgeDocuments();

  const handleDeleteDocument = async (documentId: string) => {
    await deleteDocument(documentId);
  };

  const handleSaveDocument = async () => {
    await fetchDocuments();
    setEditingDocument(null);
  };

  const openCreateModal = () => {
    setEditingDocument(null);
    setIsDocumentModalOpen(true);
  };

  const openEditModal = (document: any) => {
    setEditingDocument(document);
    setIsDocumentModalOpen(true);
  };

  const handleDocumentSelect = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      openEditModal(document);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <KnowledgePageHeader onCreateDocument={openCreateModal} />

        <Tabs defaultValue="traditional" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="traditional" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Busca Tradicional
            </TabsTrigger>
            <TabsTrigger value="intelligent" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Busca Inteligente IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traditional" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="intelligent" className="space-y-6">
            <IntelligentSearchPanel onDocumentSelect={handleDocumentSelect} />
            
            <DocumentList
              documents={documents}
              isLoading={isLoading}
              searchTerm=""
              selectedCategory="all"
              onEditDocument={openEditModal}
              onDeleteDocument={handleDeleteDocument}
            />
          </TabsContent>
        </Tabs>

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
