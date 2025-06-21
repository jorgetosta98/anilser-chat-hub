
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonalization } from "@/hooks/usePersonalization";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  const { settings } = usePersonalization();

  return (
    <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar">
      <div className="flex items-center space-x-3">
        {!isCollapsed && (
          <>
            {settings.customLogo ? (
              <img
                src={settings.customLogo}
                alt="Logo da empresa"
                className="w-8 h-8 rounded object-contain"
                onError={(e) => {
                  console.error('Erro ao carregar logo no sidebar:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-primary-custom rounded flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Safeboy</h1>
              <p className="text-xs text-sidebar-foreground/60">AI Assistant</p>
            </div>
          </>
        )}
        {isCollapsed && (
          settings.customLogo ? (
            <img
              src={settings.customLogo}
              alt="Logo"
              className="w-8 h-8 rounded object-contain mx-auto"
              onError={(e) => {
                console.error('Erro ao carregar logo no sidebar colapsado:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-8 h-8 bg-primary-custom rounded flex items-center justify-center mx-auto">
              <Settings className="w-5 h-5 text-white" />
            </div>
          )
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCollapse}
        className="text-sidebar-foreground hover:bg-sidebar-accent"
      >
        {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </Button>
    </div>
  );
}
