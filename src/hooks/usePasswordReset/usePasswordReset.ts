
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PasswordResetFormData, PasswordResetHookReturn } from "./types";
import { validatePasswordResetForm } from "./validation";
import { updateUserPassword, getPasswordUpdateErrorMessage } from "./passwordResetService";

const initialFormData: PasswordResetFormData = {
  newPassword: "",
  confirmPassword: ""
};

export const usePasswordReset = (): PasswordResetHookReturn => {
  const [formData, setFormData] = useState<PasswordResetFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (): Promise<boolean> => {
    // Validate form data
    const validation = validatePasswordResetForm(formData);
    if (!validation.isValid) {
      toast({
        title: "Erro",
        description: validation.errorMessage,
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      await updateUserPassword(formData.newPassword);
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
      
      resetForm();
      return true;
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      
      const errorMessage = getPasswordUpdateErrorMessage(error);
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleSubmit,
    resetForm
  };
};
