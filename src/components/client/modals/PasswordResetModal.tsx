
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordResetModal({
  isOpen,
  onClose
}: PasswordResetModalProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push("A senha deve ter pelo menos 6 caracteres");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("A senha deve conter pelo menos um número");
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      toast({
        title: "Senha inválida",
        description: passwordErrors.join(". "),
        variant: "destructive",
      });
      return;
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
      
      // Resetar formulário
      setFormData({
        newPassword: "",
        confirmPassword: ""
      });
      
      onClose();
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      newPassword: "",
      confirmPassword: ""
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Redefinir Senha"
      onSubmit={handleSubmit}
      submitText="Alterar Senha"
      isLoading={isLoading}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="newPassword">Nova senha</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              placeholder="Digite sua nova senha"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Confirme sua nova senha"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium">A senha deve conter:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Pelo menos 6 caracteres</li>
            <li>Pelo menos uma letra maiúscula</li>
            <li>Pelo menos uma letra minúscula</li>
            <li>Pelo menos um número</li>
          </ul>
        </div>
      </div>
    </FormModal>
  );
}
