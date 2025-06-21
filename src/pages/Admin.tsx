
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { ConversationMonitoring } from "@/components/admin/ConversationMonitoring";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { Shield } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Admin() {
  const location = useLocation();
  
  // Render different content based on URL
  const renderContent = () => {
    if (location.pathname === '/admin/users') return <UserManagement />;
    if (location.pathname === '/admin/conversations') return <ConversationMonitoring />;
    if (location.pathname === '/admin/settings') return <SystemSettings />;
    return <AdminDashboard />;
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin/users') return 'Gerenciamento de Usuários';
    if (location.pathname === '/admin/conversations') return 'Monitoramento de Conversas';
    if (location.pathname === '/admin/settings') return 'Configurações do Sistema';
    return 'Dashboard';
  };

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground">{getPageTitle()}</p>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
