
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/f742fb87-1258-499b-8a89-f5697f8bb611.png" 
              alt="ZapBase Logo" 
              className="h-8 w-auto"
            />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleCollapse}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
