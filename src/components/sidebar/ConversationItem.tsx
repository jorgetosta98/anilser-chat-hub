
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConversationItemProps {
  conversation: {
    id: string;
    title: string;
    updated_at?: string;
    created_at?: string;
  };
  isActive: boolean;
  onUpdateTitle: (id: string, title: string) => void;
}

export function ConversationItem({ conversation, isActive, onUpdateTitle }: ConversationItemProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const navigate = useNavigate();

  const handleDoubleClick = (conversationId: string, title: string) => {
    setEditingId(conversationId);
    setEditingTitle(title);
  };

  const handleEditSave = async () => {
    if (editingId && editingTitle.trim()) {
      onUpdateTitle(editingId, editingTitle.trim());
      setEditingId(null);
      setEditingTitle("");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="group relative">
      <div className={`
        p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors
        ${isActive ? 'bg-primary/10 border border-primary/20' : ''}
      `}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0" onClick={() => !editingId && navigate(`/chat/${conversation.id}`)}>
            {editingId === conversation.id ? (
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSave();
                    } else if (e.key === 'Escape') {
                      handleEditCancel();
                    }
                  }}
                  className="h-8 text-sm"
                  autoFocus
                />
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    onClick={handleEditSave}
                    className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEditCancel}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 
                  className="font-medium text-gray-900 truncate"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleDoubleClick(conversation.id, conversation.title);
                  }}
                >
                  {conversation.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(conversation.updated_at || conversation.created_at || '')}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
