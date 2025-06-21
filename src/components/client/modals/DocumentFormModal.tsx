
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2 } from "lucide-react";
import { DocumentFileUpload } from "./DocumentFileUpload";
import { DocumentTagsInput } from "./DocumentTagsInput";
import { DocumentFormFields } from "./DocumentFormFields";
import { useDocumentForm } from "@/hooks/useDocumentForm";
import { useDocumentFormSubmission } from "./DocumentFormSubmission";

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
  const {
    formData,
    categories,
    uploadedFile,
    isAnalyzing,
    fetchCategories,
    handleFileSelect,
    handleFileRemove,
    updateFormData,
  } = useDocumentForm(document);

  const {
    handleSubmit,
    isLoading,
    isUploading,
  } = useDocumentFormSubmission({
    formData,
    uploadedFile,
    document,
    onSave,
    onClose
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const hasUploadedFile = Boolean(uploadedFile || formData.file_url);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg flex items-center gap-2">
            {document ? "Editar Documento" : "Novo Documento"}
            {isAnalyzing && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <Loader2 className="w-3 h-3 animate-spin" />
                Analisando com IA...
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <DocumentFormFields
                title={formData.title}
                summary={formData.summary}
                content={formData.content}
                context={formData.context}
                categoryId={formData.category_id}
                isPublic={formData.is_public}
                categories={categories}
                hasFile={hasUploadedFile}
                onTitleChange={(value) => updateFormData({ title: value })}
                onSummaryChange={(value) => updateFormData({ summary: value })}
                onContentChange={(value) => updateFormData({ content: value })}
                onContextChange={(value) => updateFormData({ context: value })}
                onCategoryChange={(value) => updateFormData({ category_id: value })}
                onPublicChange={(value) => updateFormData({ is_public: value })}
              />
            </div>

            <div className="space-y-3">
              <DocumentFileUpload
                uploadedFile={uploadedFile}
                existingFileUrl={formData.file_url}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />

              <DocumentTagsInput
                tags={formData.tags}
                onTagsChange={(tags) => updateFormData({ tags })}
              />

              {isAnalyzing && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">Análise Inteligente</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Nossa IA está analisando o documento para sugerir resumo, tags e categoria automaticamente.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isUploading || isAnalyzing}>
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
