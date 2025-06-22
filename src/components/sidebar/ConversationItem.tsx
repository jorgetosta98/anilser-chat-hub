
import { MessageSquare, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ConversationItemProps {
  conversation: {
    id: string;
    title: string;
    updated_at?: string;
    created_at?: string;
  };
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationItem({ conversation, onEdit, onDelete }: ConversationItemProps) {
  const [editingConversation, setEditingConversation] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  
  const navigate = useNavigate();
  const { chatId } = useParams();

  const handleEditStart = () => {
    setEditingConversation(conversation.id);
    setEditTitle(conversation.title);
    setOpenPopover(false);
  };

  const handleEditSave = () => {
    if (editingConversation && editTitle.trim()) {
      onEdit(editingConversation, editTitle.trim());
      setEditingConversation(null);
      setEditTitle("");
    }
  };

  const handleEditCancel = () => {
    setEditingConversation(null);
    setEditTitle("");
  };

  const handleDeleteStart = () => {
    onDelete(conversation.id);
    setOpenPopover(false);
  };

  return (
    <div className="group relative">
      <div 
        className={`
          px-2 py-2 rounded-md hover:bg-sidebar-accent/50 cursor-pointer transition-colors flex items-center justify-between
          ${chatId === conversation.id ? 'bg-sidebar-accent/30' : ''}
        `}
        onClick={() => navigate(`/chat/${conversation.id}`)}
      >
        <div className="flex items-center min-w-0 flex-1">
          <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            {editingConversation === conversation.id ? (
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleEditSave();
                    if (e.key === 'Escape') handleEditCancel();
                  }}
                  className="h-6 text-sm"
                  autoFocus
                />
                <div className="flex space-x-1">
                  <Button size="sm" onClick={handleEditSave} className="h-6 px-2 text-xs">
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleEditCancel} className="h-6 px-2 text-xs">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <h3 className="font-medium text-sidebar-foreground truncate text-sm">
                {conversation.title}
              </h3>
            )}
          </div>
        </div>
        
        {editingConversation !== conversation.id && (
          <Popover 
            open={openPopover} 
            onOpenChange={setOpenPopover}
          >
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-sidebar-accent-foreground/10"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-1" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2"
                  onClick={handleEditStart}
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDeleteStart}
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Excluir
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
