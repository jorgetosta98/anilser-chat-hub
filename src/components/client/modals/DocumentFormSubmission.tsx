
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentFormValidation } from "@/hooks/useDocumentFormValidation";
import { useAuth } from "@/contexts/AuthContext";

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

interface DocumentFormSubmissionProps {
  formData: DocumentFormData;
  uploadedFile: File | null;
  document?: any;
  onSave: (documentData: DocumentFormData) => void;
  onClose: () => void;
}

export function useDocumentFormSubmission({
  formData,
  uploadedFile,
  document,
  onSave,
  onClose
}: DocumentFormSubmissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { validateForm } = useDocumentFormValidation();
  const { user } = useAuth();

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
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar documentos.",
        variant: "destructive",
      });
      return;
    }
    
    const isValid = validateForm({
      title: formData.title,
      content: formData.content,
      hasFile: !!uploadedFile,
      hasExistingFile: !!formData.file_url,
    });

    if (!isValid) return;

    setIsLoading(true);

    try {
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
        user_id: user.id,
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
          .insert(documentData);

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

  return {
    handleSubmit,
    isLoading,
    isUploading,
  };
}
