
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Settings, Shield, Bell, Database } from "lucide-react";
import { useState } from "react";

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: "Safeboy",
    enableNotifications: true,
    autoBackup: true,
    maintenanceMode: false,
    maxUsers: 1000,
    sessionTimeout: 30,
    enableLogging: true,
    debugMode: false
  });

  const handleSave = () => {
    // Em um app real, salvaria as configurações na API
    console.log("Configurações salvas:", settings);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configurações Gerais</span>
              </CardTitle>
              <CardDescription>
                Configure as opções básicas do sistema
              </CardDescription>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nome do Sistema</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUsers">Máximo de Usuários</Label>
              <Input
                id="maxUsers"
                type="number"
                value={settings.maxUsers}
                onChange={(e) => setSettings({...settings, maxUsers: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notificações e Alertas</span>
          </CardTitle>
          <CardDescription>
            Configure alertas e notificações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações importantes por email
              </p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Automático</Label>
              <p className="text-sm text-muted-foreground">
                Realizar backup automático dos dados
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Segurança e Manutenção</span>
          </CardTitle>
          <CardDescription>
            Configurações de segurança e manutenção do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo de Manutenção</Label>
              <p className="text-sm text-muted-foreground">
                Ativar modo de manutenção (bloqueia acesso de usuários)
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Logs do Sistema</Label>
              <p className="text-sm text-muted-foreground">
                Registrar logs detalhados de atividades
              </p>
            </div>
            <Switch
              checked={settings.enableLogging}
              onCheckedChange={(checked) => setSettings({...settings, enableLogging: checked})}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Debug</Label>
              <p className="text-sm text-muted-foreground">
                Ativar informações de debug (apenas para desenvolvimento)
              </p>
            </div>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={(checked) => setSettings({...settings, debugMode: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Informações do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium">Versão</Label>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Último Backup</Label>
              <p className="text-sm text-muted-foreground">15/01/2024 03:00</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Espaço em Disco</Label>
              <p className="text-sm text-muted-foreground">2.3 GB / 10 GB</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Uptime</Label>
              <p className="text-sm text-muted-foreground">7 dias, 14 horas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
