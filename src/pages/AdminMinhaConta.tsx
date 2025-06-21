
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, User, Lock, Shield, Settings } from "lucide-react";
import { AdminProfileModal } from "@/components/admin/modals/AdminProfileModal";
import { AdminPasswordModal } from "@/components/admin/modals/AdminPasswordModal";
import { AdminPreferencesModal } from "@/components/admin/modals/AdminPreferencesModal";

export default function AdminMinhaConta() {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  const adminData = {
    name: "Administrador do Sistema",
    email: "admin@safeboy.com",
    accessLevel: "Super Administrador"
  };

  const preferences = {
    systemNotifications: true,
    weeklyReports: true,
    securityAlerts: true,
    emailDigest: false,
    darkMode: false
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minha Conta - Administrador</h1>
            <p className="text-gray-600">Gerencie suas configurações administrativas</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Admin Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-primary" />
                  <span>Perfil Administrativo</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Administrador
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nome:</p>
                  <p className="font-semibold">Administrador do Sistema</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email:</p>
                  <p className="font-semibold">admin@safeboy.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nível de acesso:</p>
                  <p className="font-semibold">Super Administrador</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary-50"
                  onClick={() => setProfileModalOpen(true)}
                >
                  Editar Perfil
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-primary" />
                <span>Configurações de Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-600 mb-3">
                  Mantenha sua conta administrativa segura com senhas fortes e configurações adequadas.
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary-50"
                    onClick={() => setPasswordModalOpen(true)}
                  >
                    Alterar Senha
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-primary" />
                <span>Preferências Administrativas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-600 mb-3">
                  Configure suas preferências para o painel administrativo.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notificações de sistema</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Relatórios semanais</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alertas de segurança</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Ativo
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary-50"
                  onClick={() => setPreferencesModalOpen(true)}
                >
                  Configurar Preferências
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary" />
                <span>Informações do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Último acesso:</p>
                  <p className="font-semibold">Hoje às 14:30</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sessões ativas:</p>
                  <p className="font-semibold">2 dispositivos</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Logs de auditoria:</p>
                  <Button variant="link" className="text-primary p-0 h-auto">
                    Ver histórico completo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AdminProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        adminData={adminData}
      />

      <AdminPasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />

      <AdminPreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        preferences={preferences}
      />
    </div>
  );
}
