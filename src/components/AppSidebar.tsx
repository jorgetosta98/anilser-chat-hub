import { MessageSquare, Plus, BarChart3, Link, User, LogOut, FileText, Palette, Shield, Users, Settings, CreditCard } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { ScrollArea } from "@/components/ui/scroll-area";

const regularTopMenuItems = [{
  title: "Nova Conversa",
  icon: Plus,
  path: "/",
  action: true
}];

// Lista dos últimos 10 chats
const recentChats = [{
  id: 1,
  title: "Consulta sobre segurança",
  date: "Hoje"
}, {
  id: 2,
  title: "Dúvidas sobre relatórios",  
  date: "Ontem"
}, {
  id: 3,
  title: "Configuração inicial",
  date: "2 dias atrás"
}, {
  id: 4,
  title: "Integração WhatsApp",
  date: "3 dias atrás"
}, {
  id: 5,
  title: "Problemas de conexão",
  date: "4 dias atrás"
}, {
  id: 6,
  title: "Análise de dados",
  date: "5 dias atrás"
}, {
  id: 7,
  title: "Configuração de alertas",
  date: "6 dias atrás"
}, {
  id: 8,
  title: "Backup de informações",
  date: "1 semana atrás"
}, {
  id: 9,
  title: "Suporte técnico",
  date: "1 semana atrás"
}, {
  id: 10,
  title: "Tutorial inicial",
  date: "2 semanas atrás"
}];

const regularBottomMenuItems = [{
  title: "Conexões",
  icon: Link,
  path: "/conexoes"
}, {
  title: "Base de Conhecimento",
  icon: FileText,
  path: "/base-conhecimento"
}, {
  title: "Personalização",
  icon: Palette,
  path: "/personalizacao"
}, {
  title: "Relatórios",
  icon: BarChart3,
  path: "/relatorios"
}, {
  title: "Minha Conta",
  icon: User,
  path: "/minha-conta"
}, {
  title: "Sair",
  icon: LogOut,
  path: "/login",
  danger: true,
  action: "logout"
}];

const adminTopMenuItems = [{
  title: "Dashboard",
  icon: BarChart3,
  path: "/admin"
}, {
  title: "Usuários",
  icon: Users,
  path: "/admin/users"
}, {
  title: "Conversas",
  icon: MessageSquare,
  path: "/admin/conversations"
}, {
  title: "Planos",
  icon: CreditCard,
  path: "/admin/plans"
}];

const adminBottomMenuItems = [{
  title: "Configurações",
  icon: Settings,
  path: "/admin/settings"
}, {
  title: "Minha Conta",
  icon: User,
  path: "/admin/minha-conta"
}, {
  title: "Sair",
  icon: LogOut,
  path: "/login",
  danger: true,
  action: "logout"
}];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  // Check if user is in admin area
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col flex-shrink-0`}>
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />

      {isAdminArea ? (
        // Admin Menu
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Menu Items */}
          <div className="p-4 space-y-2 border-b border-sidebar-border">
            {adminTopMenuItems.map(item => (
              <SidebarMenuItem
                key={item.title}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          {/* Bottom Menu Items */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="p-4 space-y-2 border-t border-sidebar-border">
              {adminBottomMenuItems.map(item => (
                <SidebarMenuItem
                  key={item.title}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Regular User Menu
        <>
          {/* Top Menu Items */}
          <div className="p-4 space-y-2 border-b border-sidebar-border">
            {regularTopMenuItems.map(item => (
              <SidebarMenuItem
                key={item.title}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          {/* Recent Chats List - Fixed height, no scroll */}
          {!isCollapsed && (
            <div className="flex-1 min-h-0">
              <div className="p-4 h-full flex flex-col">
                <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
                  Conversas Recentes
                </h3>
                <div className="space-y-1 flex-1">
                  {recentChats.slice(0, 10).map(chat => (
                    <SidebarMenuItem
                      key={chat.id}
                      item={{
                        title: chat.title,
                        icon: MessageSquare,
                        path: `/chat/${chat.id}`
                      }}
                      isCollapsed={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Menu Items */}
          <div className="mt-auto">
            <div className="p-4 space-y-2 border-t border-sidebar-border">
              {regularBottomMenuItems.map(item => (
                <SidebarMenuItem
                  key={item.title}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
}
