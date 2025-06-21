
import { MessageSquare, Plus, BarChart3, Link, User, LogOut, FileText, Palette } from "lucide-react";
import { useState } from "react";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarFooter } from "./sidebar/SidebarFooter";

const topMenuItems = [{
  title: "Nova Conversa",
  icon: Plus,
  path: "/",
  action: true
}, {
  title: "Chat",
  icon: MessageSquare,
  path: "/chat",
  expandable: true
}];

const bottomMenuItems = [{
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

// Mock data for chat history - in a real app, this would come from your state management
const chatHistory = [{
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
}];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}>
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />

      {/* Top Menu Items */}
      <div className="p-4 space-y-2 border-b border-sidebar-border">
        {topMenuItems.map(item => (
          <SidebarMenuItem
            key={item.title}
            item={item}
            isCollapsed={isCollapsed}
            isChatExpanded={isChatExpanded}
            onChatExpandChange={setIsChatExpanded}
            chatHistory={chatHistory}
          />
        ))}
      </div>

      {/* Bottom Menu Items */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="p-4 space-y-2 border-t border-sidebar-border">
          {bottomMenuItems.map(item => (
            <SidebarMenuItem
              key={item.title}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
