
import { MessageSquare } from "lucide-react";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { regularTopMenuItems, regularBottomMenuItems, recentChats } from "./menuData";

interface RegularUserSidebarProps {
  isCollapsed: boolean;
}

export function RegularUserSidebar({ isCollapsed }: RegularUserSidebarProps) {
  return (
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
              {recentChats.slice(0, 8).map(chat => (
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
  );
}
