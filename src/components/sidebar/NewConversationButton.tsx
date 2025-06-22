
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewConversationButtonProps {
  onClick: () => void;
  isCollapsed: boolean;
}

export function NewConversationButton({ onClick, isCollapsed }: NewConversationButtonProps) {
  return (
    <div className="p-4 space-y-2 border-b border-sidebar-border">
      <Button
        onClick={onClick}
        className="w-full justify-start bg-primary hover:bg-primary/90 text-white"
      >
        <MessageSquare className="w-4 h-4" />
        {!isCollapsed && <span className="ml-2">Nova Conversa</span>}
      </Button>
    </div>
  );
}
