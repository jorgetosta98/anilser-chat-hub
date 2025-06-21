
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Plan } from "@/types/plans";
import { useToast } from "@/hooks/use-toast";

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan;
  onSave: (plan: Plan) => void;
}

export function PlanFormModal({ isOpen, onClose, plan, onSave }: PlanFormModalProps) {
  const [formData, setFormData] = useState<Plan>({
    id: plan?.id || "",
    name: plan?.name || "",
    price: plan?.price || 0,
    whatsappLimit: plan?.whatsappLimit || 1,
    dailyQuestionsLimit: plan?.dailyQuestionsLimit || 10,
    features: plan?.features || [""],
    isActive: plan?.isActive ?? true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.name || formData.price < 0) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório e preço deve ser positivo",
        variant: "destructive"
      });
      return;
    }

    const cleanFeatures = formData.features.filter(f => f.trim() !== "");
    if (cleanFeatures.length === 0) {
      toast({
        title: "Erro",
        description: "Pelo menos um recurso deve ser informado",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      const planToSave = {
        ...formData,
        features: cleanFeatures,
        id: formData.id || formData.name.toLowerCase().replace(/\s+/g, '-')
      };
      onSave(planToSave);
      toast({
        title: "Sucesso",
        description: plan ? "Plano atualizado com sucesso" : "Plano criado com sucesso"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o plano",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={plan ? "Editar Plano" : "Novo Plano"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome do Plano *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Premium"
            />
          </div>

          <div>
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="whatsapp">Limite WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsappLimit === 'unlimited' ? 'unlimited' : formData.whatsappLimit}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ 
                  ...formData, 
                  whatsappLimit: value === 'unlimited' ? 'unlimited' : parseInt(value) || 1 
                });
              }}
              placeholder="1 ou 'unlimited'"
            />
          </div>

          <div>
            <Label htmlFor="questions">Limite Perguntas/Dia</Label>
            <Input
              id="questions"
              type="number"
              min="1"
              value={formData.dailyQuestionsLimit}
              onChange={(e) => setFormData({ ...formData, dailyQuestionsLimit: parseInt(e.target.value) || 10 })}
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Recursos do Plano *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Descreva um recurso do plano"
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="active">Plano Ativo</Label>
        </div>
      </div>
    </FormModal>
  );
}
