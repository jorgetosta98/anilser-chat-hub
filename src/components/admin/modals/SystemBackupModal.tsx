
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackupItem {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
}

const mockBackups: BackupItem[] = [
  {
    id: "1",
    name: "Backup Completo - Janeiro 2024",
    date: "2024-01-15T10:30:00Z",
    size: "2.5 GB",
    type: "Completo"
  },
  {
    id: "2", 
    name: "Backup Incremental - Janeiro 2024",
    date: "2024-01-10T09:15:00Z",
    size: "450 MB",
    type: "Incremental"
  }
];

interface SystemBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemBackupModal({
  isOpen,
  onClose
}: SystemBackupModalProps) {
  const [settings, setSettings] = useState({
    autoBackup: true,
    frequency: "daily",
    includeUserData: true,
    includeConversations: true,
    includeSystemSettings: true,
    retentionDays: "30"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const { toast } = useToast();

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Backup criado",
        description: "O backup do sistema foi criado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o backup.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de backup foram atualizadas.",
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
      title="Gerenciar Backups do Sistema"
      onSubmit={handleSaveSettings}
      submitText="Salvar Configurações"
      isLoading={isLoading}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="bg-primary hover:bg-primary-600"
          >
            {isCreatingBackup ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Criando Backup...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Criar Backup Agora
              </>
            )}
          </Button>
        </div>

        {/* Backup Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Configurações de Backup</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Automático</Label>
                <p className="text-sm text-gray-600">Executar backups automaticamente</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => 
                  setSettings({...settings, autoBackup: checked})
                }
              />
            </div>
            
            {settings.autoBackup && (
              <div>
                <Label>Frequência</Label>
                <Select 
                  value={settings.frequency} 
                  onValueChange={(value) => setSettings({...settings, frequency: value})}
                >
                  <SelectTrigger className="mt-2 max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label className="text-base font-medium">Conteúdo do Backup</Label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Dados dos Usuários</Label>
                  <Switch
                    checked={settings.includeUserData}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, includeUserData: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Conversas e Mensagens</Label>
                  <Switch
                    checked={settings.includeConversations}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, includeConversations: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Configurações do Sistema</Label>
                  <Switch
                    checked={settings.includeSystemSettings}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, includeSystemSettings: checked})
                    }
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label>Retenção de Backups</Label>
              <Select 
                value={settings.retentionDays} 
                onValueChange={(value) => setSettings({...settings, retentionDays: value})}
              >
                <SelectTrigger className="mt-2 max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                  <SelectItem value="365">1 ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Backup History */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Backups Disponíveis</h3>
          <div className="space-y-3">
            {mockBackups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{backup.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(backup.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} • {backup.size}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{backup.type}</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormModal>
  );
}
