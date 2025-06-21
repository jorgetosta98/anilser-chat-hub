
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSettingsModal({
  isOpen,
  onClose
}: NotificationSettingsModalProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    chatNotifications: true,
    reportNotifications: true,
    marketingEmails: false,
    frequency: "instant"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Configurações salvas",
        description: "Suas preferências de notificação foram atualizadas.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
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
      title="Configurações de Notificação"
      onSubmit={handleSubmit}
      submitText="Salvar Configurações"
      isLoading={isLoading}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">Tipos de Notificação</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-gray-600">Receba atualizações por e-mail</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings({...settings, emailNotifications: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações Push</Label>
                <p className="text-sm text-gray-600">Notificações no navegador</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => 
                  setSettings({...settings, pushNotifications: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS</Label>
                <p className="text-sm text-gray-600">Receba SMS em situações críticas</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => 
                  setSettings({...settings, smsNotifications: checked})
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Conteúdo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Novas Conversas</Label>
                <p className="text-sm text-gray-600">Quando houver nova mensagem</p>
              </div>
              <Switch
                checked={settings.chatNotifications}
                onCheckedChange={(checked) => 
                  setSettings({...settings, chatNotifications: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Relatórios</Label>
                <p className="text-sm text-gray-600">Relatórios periódicos disponíveis</p>
              </div>
              <Switch
                checked={settings.reportNotifications}
                onCheckedChange={(checked) => 
                  setSettings({...settings, reportNotifications: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>E-mails de Marketing</Label>
                <p className="text-sm text-gray-600">Novidades e promoções</p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => 
                  setSettings({...settings, marketingEmails: checked})
                }
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Frequência das Notificações</Label>
          <Select 
            value={settings.frequency} 
            onValueChange={(value) => setSettings({...settings, frequency: value})}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instantâneo</SelectItem>
              <SelectItem value="hourly">A cada hora</SelectItem>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormModal>
  );
}
