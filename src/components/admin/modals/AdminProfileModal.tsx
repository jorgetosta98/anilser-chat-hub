
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminData?: {
    name: string;
    email: string;
    accessLevel: string;
  };
}

export function AdminProfileModal({
  isOpen,
  onClose,
  adminData
}: AdminProfileModalProps) {
  const [formData, setFormData] = useState({
    name: adminData?.name || "Administrador do Sistema",
    email: adminData?.email || "admin@safeboy.com",
    accessLevel: adminData?.accessLevel || "Super Administrador"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Perfil atualizado",
        description: "Dados administrativos atualizados com sucesso.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil. Tente novamente.",
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
      title="Editar Perfil Administrativo"
      onSubmit={handleSubmit}
      submitText="Salvar Alterações"
      isLoading={isLoading}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Nome do administrador"
          />
        </div>
        
        <div>
          <Label htmlFor="email">E-mail administrativo</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="E-mail administrativo"
          />
        </div>
        
        <div>
          <Label htmlFor="accessLevel">Nível de acesso</Label>
          <Input
            id="accessLevel"
            type="text"
            value={formData.accessLevel}
            readOnly
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Nível de acesso não pode ser alterado por questões de segurança
          </p>
        </div>
      </div>
    </FormModal>
  );
}
