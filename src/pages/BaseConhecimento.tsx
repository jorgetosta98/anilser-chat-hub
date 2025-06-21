
import { useState, useEffect } from "react";
import { Upload, File, Trash2, Eye, Plus, Tag, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DocumentFormModal } from "@/components/client/modals/DocumentFormModal";
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
    // Refresh the documents list after saving
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.summary?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || doc.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Base de Conhecimento</h1>
            <p className="text-gray-600">
              Gerencie documentos, procedimentos e informações para melhorar a precisão das respostas da IA
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Documento
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Pesquisar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Documentos */}
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
                  <div
                    key={document.id}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{document.title}</h3>
                        {document.category && (
                          <Badge 
                            variant="secondary" 
                            style={{ backgroundColor: `${document.category.color}20`, color: document.category.color }}
                          >
                            {document.category.name}
                          </Badge>
                        )}
                        {!document.is_public && (
                          <Badge variant="outline">Privado</Badge>
                        )}
                      </div>
                      
                      {document.summary && (
                        <p className="text-sm text-gray-600 mb-2">{document.summary}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(document.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {document.views_count} visualizações
                        </div>
                      </div>

                      {document.tags && document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {document.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditModal(document)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
