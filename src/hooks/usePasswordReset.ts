
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/utils/passwordValidation";

export const usePasswordReset = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return false;
    }

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      toast({
        title: "Senha inválida",
        description: passwordErrors.join(". "),
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      console.log('Iniciando atualização de senha...');
      
      // Atualizar senha no Supabase
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }
      
      console.log('Senha atualizada com sucesso');
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
      
      resetForm();
      return true;
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      
      let errorMessage = "Ocorreu um erro ao alterar sua senha. Tente novamente.";
      
      if (error.message?.includes('New password should be different')) {
        errorMessage = "A nova senha deve ser diferente da atual.";
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.message?.includes('same_password')) {
        errorMessage = "A nova senha deve ser diferente da senha atual.";
      } else if (error.message?.includes('weak_password')) {
        errorMessage = "A senha é muito fraca. Use uma senha mais forte.";
      }
      
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
