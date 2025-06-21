
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { regularTopMenuItems, regularBottomMenuItems, recentChats } from "./menuData";

interface RegularUserSidebarProps {
  isCollapsed: boolean;
}

export function RegularUserSidebar({ isCollapsed }: RegularUserSidebarProps) {
  const [showRecentChats, setShowRecentChats] = useState(true);

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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Conversas Recentes
              </h3>
              <button
                onClick={() => setShowRecentChats(!showRecentChats)}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
              >
                {showRecentChats ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="space-y-1 flex-1 relative">
              {recentChats.slice(0, 9).map(chat => (
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
              {!showRecentChats && (
                <div className="absolute inset-0 backdrop-blur-sm bg-sidebar-background/30 flex items-center justify-center">
                  <div className="text-sidebar-foreground/70 text-sm font-medium bg-sidebar-background/80 px-3 py-2 rounded-md border border-sidebar-border">
                    Conversas ocultas
                  </div>
                </div>
              )}
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
