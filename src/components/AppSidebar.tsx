
import { 
  MessageSquare, 
  Plus, 
  BarChart3, 
  Link, 
  User, 
  LogOut,
  Shield,
  Menu,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const topMenuItems = [
  { title: "Nova Conversa", icon: Plus, path: "/", action: true },
  { title: "Chat", icon: MessageSquare, path: "/chat", expandable: true },
];

const bottomMenuItems = [
  { title: "Conexões", icon: Link, path: "/conexoes" },
  { title: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { title: "Minha Conta", icon: User, path: "/minha-conta" },
  { title: "Sair", icon: LogOut, path: "/sair", danger: true },
];

// Mock data for chat history - in a real app, this would come from your state management
const chatHistory = [
  { id: 1, title: "Consulta sobre segurança", date: "Hoje" },
  { id: 2, title: "Dúvidas sobre relatórios", date: "Ontem" },
  { id: 3, title: "Configuração inicial", date: "2 dias atrás" },
  { id: 4, title: "Integração WhatsApp", date: "3 dias atrás" },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const location = useLocation();

  const renderMenuItem = (item: any) => {
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

    if (item.expandable && !isCollapsed) {
      return (
        <div key={item.title} className="space-y-1">
          <Collapsible open={isChatExpanded} onOpenChange={setIsChatExpanded}>
            <div className="flex items-center">
              <RouterLink to={item.path} className="flex-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-primary' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
                  } px-4`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="ml-2">{item.title}</span>
                </Button>
              </RouterLink>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  {isChatExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-1">
              <div className="ml-6 space-y-1">
                {chatHistory.map((chat) => (
                  <RouterLink key={chat.id} to={`/chat/${chat.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary px-2 py-1 h-8"
                    >
                      <span className="truncate">{chat.title}</span>
                    </Button>
                  </RouterLink>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
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
  };

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
      <div className="flex-1 flex flex-col">
        {/* Top Menu Items */}
        <div className="p-4 space-y-2">
          {topMenuItems.map(renderMenuItem)}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Menu Items */}
        <div className="p-4 space-y-2 border-t border-sidebar-border">
          {bottomMenuItems.map(renderMenuItem)}
        </div>
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
