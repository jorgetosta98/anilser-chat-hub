
import { useToast } from "@/hooks/use-toast";

interface ValidationData {
  title: string;
  content: string;
  hasFile: boolean;
  hasExistingFile: boolean;
}

export function useDocumentFormValidation() {
  const { toast } = useToast();

  const validateForm = ({ title, content, hasFile, hasExistingFile }: ValidationData): boolean => {
    if (!title.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Título é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    // Validar se tem conteúdo OU arquivo
    if (!content.trim() && !hasFile && !hasExistingFile) {
      toast({
        title: "Conteúdo obrigatório",
        description: "É necessário fornecer conteúdo ou fazer upload de um arquivo.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateForm };
}
