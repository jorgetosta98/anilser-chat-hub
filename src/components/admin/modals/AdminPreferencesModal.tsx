
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface AdminPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences?: {
    systemNotifications: boolean;
    weeklyReports: boolean;
    securityAlerts: boolean;
    emailDigest: boolean;
    darkMode: boolean;
  };
}

export function AdminPreferencesModal({
  isOpen,
  onClose,
  preferences
}: AdminPreferencesModalProps) {
  const [formData, setFormData] = useState({
    systemNotifications: preferences?.systemNotifications ?? true,
    weeklyReports: preferences?.weeklyReports ?? true,
    securityAlerts: preferences?.securityAlerts ?? true,
    emailDigest: preferences?.emailDigest ?? false,
    darkMode: preferences?.darkMode ?? false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências administrativas foram salvas.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = (key: keyof typeof formData, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar Preferências Administrativas"
      onSubmit={handleSubmit}
      submitText="Salvar Preferências"
      isLoading={isLoading}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Notificações</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Notificações de sistema</Label>
                <p className="text-xs text-gray-500">
                  Receber alertas sobre eventos importantes do sistema
                </p>
              </div>
              <Switch
                checked={formData.systemNotifications}
                onCheckedChange={(value) => handleSwitchChange('systemNotifications', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Relatórios semanais</Label>
                <p className="text-xs text-gray-500">
                  Receber resumo semanal das atividades
                </p>
              </div>
              <Switch
                checked={formData.weeklyReports}
                onCheckedChange={(value) => handleSwitchChange('weeklyReports', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Alertas de segurança</Label>
                <p className="text-xs text-gray-500">
                  Notificações críticas de segurança
                </p>
              </div>
              <Switch
                checked={formData.securityAlerts}
                onCheckedChange={(value) => handleSwitchChange('securityAlerts', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Resumo por e-mail</Label>
                <p className="text-xs text-gray-500">
                  Digest diário das atividades por e-mail
                </p>
              </div>
              <Switch
                checked={formData.emailDigest}
                onCheckedChange={(value) => handleSwitchChange('emailDigest', value)}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Interface</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Modo escuro</Label>
              <p className="text-xs text-gray-500">
                Usar tema escuro no painel administrativo
              </p>
            </div>
            <Switch
              checked={formData.darkMode}
              onCheckedChange={(value) => handleSwitchChange('darkMode', value)}
            />
          </div>
        </div>
      </div>
    </FormModal>
  );
}
