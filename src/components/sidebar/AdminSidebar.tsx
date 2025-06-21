
import { SidebarMenuItem } from "./SidebarMenuItem";
import { adminTopMenuItems, adminBottomMenuItems } from "./menuData";

interface AdminSidebarProps {
  isCollapsed: boolean;
}

export function AdminSidebar({ isCollapsed }: AdminSidebarProps) {
  return (
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
  );
}
