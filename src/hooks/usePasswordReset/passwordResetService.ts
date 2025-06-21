
import { supabase } from "@/integrations/supabase/client";

export const updateUserPassword = async (newPassword: string): Promise<void> => {
  console.log('Iniciando atualização de senha...');
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error('Erro do Supabase:', error);
    throw error;
  }
  
  console.log('Senha atualizada com sucesso');
};

export const getPasswordUpdateErrorMessage = (error: any): string => {
  if (error.message?.includes('New password should be different')) {
    return "A nova senha deve ser diferente da atual.";
  } else if (error.message?.includes('Password should be at least')) {
    return "A senha deve ter pelo menos 6 caracteres.";
  } else if (error.message?.includes('same_password')) {
    return "A nova senha deve ser diferente da senha atual.";
  } else if (error.message?.includes('weak_password')) {
    return "A senha é muito fraca. Use uma senha mais forte.";
  }
  
  return "Ocorreu um erro ao alterar sua senha. Tente novamente.";
};
