
import { useState, useEffect } from "react";
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

export function useDocumentForm(document?: any) {
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

  const updateFormData = (updates: Partial<DocumentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    categories,
    uploadedFile,
    fetchCategories,
    handleFileSelect,
    handleFileRemove,
    updateFormData,
  };
}
