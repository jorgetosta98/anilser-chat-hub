
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, Plus, MessageSquare, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Plan, DEFAULT_PLANS } from "@/types/plans";
import { PlanFormModal } from "./modals/PlanFormModal";

export function PlanManagement() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlanData, setEditingPlanData] = useState<Plan | null>(null);

  const handleSavePlan = (planId: string, updatedPlan: Partial<Plan>) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, ...updatedPlan } : plan
    ));
    setEditingPlan(null);
  };

  const handleSavePlanFromModal = (planData: Plan) => {
    if (editingPlanData?.id) {
      // Editing existing plan
      setPlans(prev => prev.map(plan => 
        plan.id === editingPlanData.id ? planData : plan
      ));
    } else {
      // Creating new plan
      setPlans(prev => [...prev, planData]);
    }
    setEditingPlanData(null);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlanData(plan);
    setIsPlanModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingPlanData(null);
    setIsPlanModalOpen(true);
  };

  const formatWhatsAppLimit = (limit: number | 'unlimited') => {
    return limit === 'unlimited' ? 'Ilimitado' : limit.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Planos</h2>
          <p className="text-muted-foreground">Configure os planos disponíveis e seus limites</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${!plan.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {editingPlan === plan.id ? (
                      <Input
                        defaultValue={plan.name}
                        className="text-lg font-semibold"
                        onBlur={(e) => handleSavePlan(plan.id, { name: e.target.value })}
                      />
                    ) : (
                      <span>{plan.name}</span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {editingPlan === plan.id ? (
                      <Input
                        type="number"
                        defaultValue={plan.price}
                        className="mt-1"
                        placeholder="Preço"
                        onBlur={(e) => handleSavePlan(plan.id, { price: parseFloat(e.target.value) })}
                      />
                    ) : (
                      <span>R$ {plan.price.toFixed(2)}/mês</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPlan(editingPlan === plan.id ? null : plan.id)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm">WhatsApp</span>
                  </div>
                  {editingPlan === plan.id ? (
                    <Input
                      defaultValue={plan.whatsappLimit === 'unlimited' ? 'unlimited' : plan.whatsappLimit}
                      className="w-20 text-right"
                      onBlur={(e) => {
                        const value = e.target.value === 'unlimited' ? 'unlimited' : parseInt(e.target.value);
                        handleSavePlan(plan.id, { whatsappLimit: value });
                      }}
                    />
                  ) : (
                    <Badge variant="outline">
                      {formatWhatsAppLimit(plan.whatsappLimit)}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Perguntas/dia</span>
                  </div>
                  {editingPlan === plan.id ? (
                    <Input
                      type="number"
                      defaultValue={plan.dailyQuestionsLimit}
                      className="w-20 text-right"
                      onBlur={(e) => handleSavePlan(plan.id, { dailyQuestionsLimit: parseInt(e.target.value) })}
                    />
                  ) : (
                    <Badge variant="outline">
                      {plan.dailyQuestionsLimit}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`active-${plan.id}`}>Plano Ativo</Label>
                  <Switch
                    id={`active-${plan.id}`}
                    checked={plan.isActive}
                    onCheckedChange={(checked) => handleSavePlan(plan.id, { isActive: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Recursos:</Label>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlanFormModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plan={editingPlanData || undefined}
        onSave={handleSavePlanFromModal}
      />
    </div>
  );
}
