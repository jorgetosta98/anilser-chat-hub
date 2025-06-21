
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface DocumentFormData {
  id?: string;
  title: string;
  content: string;
  summary: string;
  context: string;
  category_id: string;
  tags: string[];
  file?: File;
  file_url?: string;
  file_type?: string;
  is_public: boolean;
}

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any;
  onSave: (documentData: DocumentFormData) => void;
}

export function DocumentFormModal({ isOpen, onClose, document, onSave }: DocumentFormModalProps) {
  const [formData, setFormData] = useState<DocumentFormData>({
    title: "",
    content: "",
    summary: "",
    context: "",
    category_id: "",
    tags: [],
    is_public: true,
  });
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (document) {
      setFormData({
        id: document.id,
        title: document.title || "",
        content: document.content || "",
        summary: document.summary || "",
        context: document.context || "",
        category_id: document.category_id || "",
        tags: document.tags || [],
        file_url: document.file_url,
        file_type: document.file_type,
        is_public: document.is_public ?? true,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        summary: "",
        context: "",
        category_id: "",
        tags: [],
        is_public: true,
      });
    }
    setUploadedFile(null);
  }, [document]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_categories')
        .select('id, name, color')
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: "Por favor, selecione um arquivo PDF, DOC, DOCX, TXT ou CSV.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setFormData(prev => ({
      ...prev,
      file: file,
      file_type: file.type,
      content: "" // Limpar conteúdo quando arquivo é carregado
    }));

    toast({
      title: "Arquivo selecionado",
      description: `${file.name} está pronto para upload.`,
    });
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({
      ...prev,
      file: undefined,
      file_type: undefined,
      file_url: undefined
    }));
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('knowledge-documents')
      .upload(fileName, file);

    if (error) throw error;

    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('knowledge-documents')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Título é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    // Validar se tem conteúdo OU arquivo
    if (!formData.content.trim() && !uploadedFile && !formData.file_url) {
      toast({
        title: "Conteúdo obrigatório",
        description: "É necessário fornecer conteúdo ou fazer upload de um arquivo.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      let fileUrl = formData.file_url;
      let fileType = formData.file_type;

      // Upload do arquivo se necessário
      if (uploadedFile) {
        setIsUploading(true);
        fileUrl = await uploadFileToStorage(uploadedFile);
        fileType = uploadedFile.type;
      }

      const documentData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim(),
        context: formData.context.trim(),
        category_id: formData.category_id || null,
        tags: formData.tags,
        file_url: fileUrl || null,
        file_type: fileType || null,
        is_public: formData.is_public,
        author_id: user.id,
      };

      if (document?.id) {
        // Update existing document
        const { error } = await supabase
          .from('knowledge_documents')
          .update(documentData)
          .eq('id', document.id);

        if (error) throw error;

        toast({
          title: "Documento atualizado",
          description: "O documento foi atualizado com sucesso.",
        });
      } else {
        // Create new document
        const { error } = await supabase
          .from('knowledge_documents')
          .insert([documentData]);

        if (error) throw error;

        toast({
          title: "Documento criado",
          description: "O documento foi criado com sucesso.",
        });
      }

      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o documento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const hasUploadedFile = uploadedFile || formData.file_url;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? "Editar Documento" : "Novo Documento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título do documento"
              required
            />
          </div>

          <div>
            <Label htmlFor="summary">Resumo</Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Breve resumo do documento"
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload de arquivo */}
          <div>
            <Label>Upload de Documento</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {hasUploadedFile ? (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">
                      {uploadedFile?.name || (formData.file_url ? "Arquivo já carregado" : "")}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeUploadedFile}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arraste um arquivo aqui ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    PDF, DOC, DOCX, TXT, CSV (máx. 10MB)
                  </p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.csv"
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Selecionar Arquivo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo ou Contexto */}
          {hasUploadedFile ? (
            <div>
              <Label htmlFor="context">Contexto</Label>
              <Textarea
                id="context"
                value={formData.context}
                onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                placeholder="Adicione contexto adicional sobre o documento (opcional)"
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                O conteúdo será extraído automaticamente do arquivo. Use este campo para adicionar contexto adicional.
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Digite o conteúdo do documento"
                className="min-h-[200px]"
                required
              />
            </div>
          )}

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Digite uma tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
            />
            <Label htmlFor="is_public">Documento público</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? (
                isUploading ? "Fazendo upload..." : "Salvando..."
              ) : (
                document ? "Atualizar" : "Criar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
