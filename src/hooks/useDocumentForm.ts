
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentAnalysis } from "@/hooks/useDocumentAnalysis";

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { analyzeDocument } = useDocumentAnalysis();

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

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setFormData(prev => ({
      ...prev,
      file: file,
      file_type: file.type,
      content: "" 
    }));

    // Análise automática do documento
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDocument(file);
      
      if (analysis) {
        // Aplicar sugestões da IA automaticamente
        setFormData(prev => ({
          ...prev,
          summary: analysis.suggestedSummary || prev.summary,
          tags: [...new Set([...prev.tags, ...analysis.suggestedTags])], // Combinar tags sem duplicatas
          content: analysis.extractedText || prev.content,
        }));

        // Tentar encontrar categoria correspondente
        const matchingCategory = categories.find(cat => 
          cat.name.toLowerCase().includes(analysis.suggestedCategory.toLowerCase()) ||
          analysis.suggestedCategory.toLowerCase().includes(cat.name.toLowerCase())
        );

        if (matchingCategory) {
          setFormData(prev => ({ ...prev, category_id: matchingCategory.id }));
        }

        toast({
          title: "Análise concluída",
          description: `Sugestões aplicadas: resumo, ${analysis.suggestedTags.length} tags e conteúdo extraído.`,
        });
      }
    } catch (error) {
      console.error('Erro na análise automática:', error);
    } finally {
      setIsAnalyzing(false);
    }
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
    isAnalyzing,
    fetchCategories,
    handleFileSelect,
    handleFileRemove,
    updateFormData,
  };
}
