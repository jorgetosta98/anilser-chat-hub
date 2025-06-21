
import { 
  MessageSquare, 
  Plus, 
  BarChart3, 
  Link, 
  User, 
  LogOut,
  Shield,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Nova Conversa", icon: Plus, path: "/", action: true },
  { title: "Chat", icon: MessageSquare, path: "/chat" },
  { title: "Conexões", icon: Link, path: "/conexoes" },
  { title: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { title: "Minha Conta", icon: User, path: "/minha-conta" },
  { title: "Sair", icon: LogOut, path: "/sair", danger: true },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">Safeboy</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          if (item.action) {
            return (
              <RouterLink key={item.title} to={item.path}>
                <Button
                  className={`w-full justify-start bg-primary hover:bg-primary-700 text-white ${
                    isCollapsed ? 'px-2' : 'px-4'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {!isCollapsed && <span className="ml-2">{item.title}</span>}
                </Button>
              </RouterLink>
            );
          }

          return (
            <RouterLink key={item.title} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-primary' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
                } ${item.danger ? 'hover:text-destructive' : ''} ${
                  isCollapsed ? 'px-2' : 'px-4'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            </RouterLink>
          );
        })}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border text-xs text-gray-500">
          Powered by Frotas Softwares
        </div>
      )}
    </div>
  );
}
