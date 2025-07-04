
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

  // Função para sanitizar o nome do arquivo
  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Substitui caracteres especiais por underscore
      .replace(/_{2,}/g, '_') // Remove underscores múltiplos
      .toLowerCase();
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    
    console.log('Original filename:', file.name);
    console.log('Sanitized filename:', fileName);
    
    const { data, error } = await supabase.storage
      .from('knowledge-documents')
      .upload(fileName, file);

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

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
        console.log('Iniciando upload do arquivo:', uploadedFile.name);
        fileUrl = await uploadFileToStorage(uploadedFile);
        fileType = uploadedFile.type;
        console.log('Upload concluído, URL:', fileUrl);
      }

      const documentData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary?.trim() || '',
        context: formData.context?.trim() || '',
        category_id: formData.category_id || null,
        tags: formData.tags || [],
        file_url: fileUrl || null,
        file_type: fileType || null,
        is_public: formData.is_public,
        user_id: user.id,
      };

      console.log('Dados do documento para salvar:', documentData);

      if (document?.id) {
        const { data, error } = await supabase
          .from('knowledge_documents')
          .update(documentData)
          .eq('id', document.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar documento:', error);
          throw error;
        }

        toast({
          title: "Documento atualizado",
          description: "O documento foi atualizado com sucesso.",
        });
      } else {
        const { data, error } = await supabase
          .from('knowledge_documents')
          .insert(documentData)
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar documento:', error);
          throw error;
        }

        console.log('Documento criado com sucesso:', data);

        toast({
          title: "Documento criado",
          description: "O documento foi criado com sucesso.",
        });
      }

      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving document:', error);
      
      let errorMessage = "Não foi possível salvar o documento.";
      
      if (error instanceof Error) {
        if (error.message.includes('permission') || error.message.includes('InvalidKey')) {
          errorMessage = "Erro no upload do arquivo. Verifique se o arquivo é válido.";
        } else if (error.message.includes('validation')) {
          errorMessage = "Dados inválidos. Verifique os campos obrigatórios.";
        } else if (error.message.includes('duplicate')) {
          errorMessage = "Já existe um documento com este título.";
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
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
