
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_PLANS } from "@/types/plans";
import { useToast } from "@/hooks/use-toast";

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSave: (user: User) => void;
}

export function UserFormModal({ isOpen, onClose, user, onSave }: UserFormModalProps) {
  const [formData, setFormData] = useState<User>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "usuário",
    plan: user?.plan || "free",
    status: user?.status || "ativo"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      onSave({ ...formData, id: user?.id });
      toast({
        title: "Sucesso",
        description: user ? "Usuário atualizado com sucesso" : "Usuário criado com sucesso"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Editar Usuário" : "Novo Usuário"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome completo"
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <Label htmlFor="role">Função</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usuário">Usuário</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="plan">Plano</Label>
          <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o plano" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_PLANS.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name} - R$ {plan.price.toFixed(2)}/mês
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormModal>
  );
}
