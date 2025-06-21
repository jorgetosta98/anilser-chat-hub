
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentAnalysisResult {
  extractedText: string;
  suggestedSummary: string;
  suggestedTags: string[];
  suggestedCategory: string;
  keyTopics: string[];
}

export function useDocumentAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeDocument = async (file: File): Promise<DocumentAnalysisResult | null> => {
    setIsAnalyzing(true);
    
    try {
      // Convert file to base64 for sending to edge function
      const fileData = await fileToBase64(file);
      
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          file: fileData,
          fileName: file.name,
          fileType: file.type
        }
      });

      if (error) throw error;

      toast({
        title: "Análise concluída",
        description: "Documento analisado com sucesso pela IA.",
      });

      return data;
    } catch (error) {
      console.error('Erro na análise do documento:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar o documento automaticamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return {
    analyzeDocument,
    isAnalyzing
  };
}
