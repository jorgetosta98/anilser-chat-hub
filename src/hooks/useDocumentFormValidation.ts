
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
    // Validar título
    if (!title || !title.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Título é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (title.trim().length < 3) {
      toast({
        title: "Título muito curto",
        description: "O título deve ter pelo menos 3 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    // Validar se tem conteúdo OU arquivo
    const hasContent = content && content.trim().length > 0;
    
    if (!hasContent && !hasFile && !hasExistingFile) {
      toast({
        title: "Conteúdo obrigatório",
        description: "É necessário fornecer conteúdo ou fazer upload de um arquivo.",
        variant: "destructive",
      });
      return false;
    }

    // Se tem conteúdo, validar tamanho mínimo
    if (hasContent && content.trim().length < 10) {
      toast({
        title: "Conteúdo muito curto",
        description: "O conteúdo deve ter pelo menos 10 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateForm };
}
