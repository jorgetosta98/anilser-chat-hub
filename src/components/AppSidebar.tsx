
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { RegularUserSidebar } from "./sidebar/RegularUserSidebar";
import { AdminSidebar } from "./sidebar/AdminSidebar";

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
        <AdminSidebar isCollapsed={isCollapsed} />
      ) : (
        <RegularUserSidebar isCollapsed={isCollapsed} />
      )}

      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
}
