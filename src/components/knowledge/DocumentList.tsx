
import { File } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentItem } from "./DocumentItem";

interface DocumentCategory {
  name: string;
  color: string;
}

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category_id?: string;
  category?: DocumentCategory;
  tags: string[];
  file_url?: string;
  file_type?: string;
  is_public: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

interface DocumentListProps {
  documents: KnowledgeDocument[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  onEditDocument: (document: KnowledgeDocument) => void;
  onDeleteDocument: (id: string) => void;
}

export function DocumentList({
  documents,
  isLoading,
  searchTerm,
  selectedCategory,
  onEditDocument,
  onDeleteDocument
}: DocumentListProps) {
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.summary?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || doc.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos na Base de Conhecimento</CardTitle>
        <CardDescription>
          {filteredDocuments.length} documento(s) encontrado(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando documentos...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || selectedCategory ? "Nenhum documento encontrado" : "Nenhum documento cadastrado"}
            </p>
            <p className="text-sm text-gray-400">
              {searchTerm || selectedCategory ? "Tente ajustar os filtros" : "Crie seu primeiro documento para começar"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <DocumentItem
                key={document.id}
                document={document}
                onEdit={onEditDocument}
                onDelete={onDeleteDocument}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
