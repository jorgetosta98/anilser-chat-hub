
interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  if (isCollapsed) return null;

  return (
    <div className="p-4 border-t border-sidebar-border text-xs text-gray-500">
      Powered by Frotas Softwares
    </div>
  );
}
