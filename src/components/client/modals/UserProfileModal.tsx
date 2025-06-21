
import { useState, useEffect } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
}

export function UserProfileModal({
  isOpen,
  onClose,
  userData
}: UserProfileModalProps) {
  const { updateProfile, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Atualizar dados do formulário quando userData ou profile mudarem
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: userData?.name || profile?.full_name || "",
        email: userData?.email || profile?.email || "",
        phone: userData?.phone || profile?.phone || "",
        company: userData?.company || profile?.company || ""
      });
    }
  }, [isOpen, userData, profile]);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Atualizar perfil no Supabase
      const { error } = await updateProfile({
        full_name: formData.name,
        phone: formData.phone,
        company: formData.company,
        // Nota: email não pode ser alterado diretamente via profiles
        // seria necessário usar supabase.auth.updateUser para isso
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Dados atualizados",
        description: "Seus dados foram atualizados com sucesso.",
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Meus Dados"
      onSubmit={handleSubmit}
      submitText="Salvar Alterações"
      isLoading={isLoading}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Digite seu nome completo"
          />
        </div>
        
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Digite seu e-mail"
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            O e-mail não pode ser alterado por questões de segurança
          </p>
        </div>
        
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="(11) 99999-9999"
          />
        </div>
        
        <div>
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            placeholder="Nome da empresa"
          />
        </div>
      </div>
    </FormModal>
  );
}
