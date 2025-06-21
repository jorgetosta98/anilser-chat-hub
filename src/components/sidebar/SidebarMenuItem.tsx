
import { Button } from "@/components/ui/button";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MenuItem } from "./menuData";

interface SidebarMenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
}

export function SidebarMenuItem({ 
  item, 
  isCollapsed
}: SidebarMenuItemProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const isActive = location.pathname === item.path;
  const IconComponent = item.icon;

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
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

  return (
    <RouterLink key={item.title} to={item.path}>
      <Button variant="ghost" className={`w-full justify-start ${isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'} ${item.danger ? 'hover:text-destructive' : ''} ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <IconComponent className="w-4 h-4" />
        {!isCollapsed && <span className="ml-2 truncate">{item.title}</span>}
      </Button>
    </RouterLink>
  );
}
