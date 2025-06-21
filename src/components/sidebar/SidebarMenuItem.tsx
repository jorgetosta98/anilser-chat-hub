
import { Button } from "@/components/ui/button";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MenuItem {
  title: string;
  icon: any;
  path: string;
  action?: boolean | string;
  danger?: boolean;
  expandable?: boolean;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  isChatExpanded?: boolean;
  onChatExpandChange?: (expanded: boolean) => void;
  chatHistory?: Array<{ id: number; title: string; date: string }>;
}

export function SidebarMenuItem({ 
  item, 
  isCollapsed, 
  isChatExpanded = false, 
  onChatExpandChange,
  chatHistory = []
}: SidebarMenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const IconComponent = item.icon;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  if (item.action === "logout") {
    return (
      <Button
        key={item.title}
        variant="ghost"
        onClick={handleLogout}
        className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary hover:text-destructive ${isCollapsed ? 'px-2' : 'px-4'}`}
      >
        <IconComponent className="w-4 h-4" />
        {!isCollapsed && <span className="ml-2">{item.title}</span>}
      </Button>
    );
  }

  if (item.action) {
    return (
      <RouterLink key={item.title} to={item.path}>
        <Button className={`w-full justify-start bg-primary hover:bg-primary/90 text-white ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <IconComponent className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">{item.title}</span>}
        </Button>
      </RouterLink>
    );
  }

  if (item.expandable && !isCollapsed && onChatExpandChange) {
    return (
      <div key={item.title} className="space-y-1">
        <Collapsible open={isChatExpanded} onOpenChange={onChatExpandChange}>
          <div className="flex items-center">
            <RouterLink to={item.path} className="flex-1">
              <Button variant="ghost" className={`w-full justify-start ${isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'} px-4`}>
                <IconComponent className="w-4 h-4" />
                <span className="ml-2">{item.title}</span>
              </Button>
            </RouterLink>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent">
                {isChatExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-1">
            <div className="ml-6 space-y-1 mx-0">
              {chatHistory.map(chat => (
                <RouterLink key={chat.id} to={`/chat/${chat.id}`}>
                  <Button variant="ghost" className="w-full justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary px-2 py-1 h-8">
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
      <Button variant="ghost" className={`w-full justify-start ${isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'} ${item.danger ? 'hover:text-destructive' : ''} ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <IconComponent className="w-4 h-4" />
        {!isCollapsed && <span className="ml-2">{item.title}</span>}
      </Button>
    </RouterLink>
  );
}
