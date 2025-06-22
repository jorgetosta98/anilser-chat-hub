
import { SidebarMenuItem } from "./SidebarMenuItem";
import { regularBottomMenuItems } from "./menuData";
import { NewConversationButton } from "./NewConversationButton";
import { ConversationsList } from "./ConversationsList";

interface RegularUserSidebarProps {
  isCollapsed: boolean;
}

export function RegularUserSidebar({ isCollapsed }: RegularUserSidebarProps) {
  return (
    <>
      {/* New Conversation Button */}
      <NewConversationButton isCollapsed={isCollapsed} />

      {/* Recent Chats List */}
      <ConversationsList isCollapsed={isCollapsed} />

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
