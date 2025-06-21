
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentFileUpload } from "./DocumentFileUpload";
import { DocumentTagsInput } from "./DocumentTagsInput";
import { DocumentFormFields } from "./DocumentFormFields";
import { useDocumentFormValidation } from "@/hooks/useDocumentFormValidation";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { validateForm } = useDocumentFormValidation();

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

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setFormData(prev => ({
      ...prev,
      file: file,
      file_type: file.type,
      content: "" 
    }));
  };

  const handleFileRemove = () => {
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

    const { data: urlData } = supabase.storage
      .from('knowledge-documents')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm({
      title: formData.title,
      content: formData.content,
      hasFile: !!uploadedFile,
      hasExistingFile: !!formData.file_url,
    });

    if (!isValid) return;

    setIsLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      let fileUrl = formData.file_url;
      let fileType = formData.file_type;

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

  const hasUploadedFile = Boolean(uploadedFile || formData.file_url);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {document ? "Editar Documento" : "Novo Documento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
            {/* Coluna Esquerda */}
            <div className="space-y-4 overflow-y-auto pr-2">
              <DocumentFormFields
                title={formData.title}
                summary={formData.summary}
                content={formData.content}
                context={formData.context}
                categoryId={formData.category_id}
                isPublic={formData.is_public}
                categories={categories}
                hasFile={hasUploadedFile}
                onTitleChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                onSummaryChange={(value) => setFormData(prev => ({ ...prev, summary: value }))}
                onContentChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                onContextChange={(value) => setFormData(prev => ({ ...prev, context: value }))}
                onCategoryChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                onPublicChange={(value) => setFormData(prev => ({ ...prev, is_public: value }))}
              />
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4 overflow-y-auto pr-2">
              <DocumentFileUpload
                uploadedFile={uploadedFile}
                existingFileUrl={formData.file_url}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />

              <DocumentTagsInput
                tags={formData.tags}
                onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
              />
            </div>
          </div>

          {/* Rodapé com botões */}
          <div className="flex justify-end space-x-2 pt-4 border-t flex-shrink-0">
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
