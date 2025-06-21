
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ConversationsList() {
  const { conversations, isLoading, createConversation, deleteConversation } = useConversations();
  const { chatId } = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleCreateConversation = async () => {
    const title = newTitle.trim() || 'Nova Conversa';
    createConversation(title);
    setNewTitle("");
    setIsCreating(false);
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

  if (isLoading) {
    return <div className="p-4">Carregando conversas...</div>;
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            className="bg-primary hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {isCreating && (
          <div className="space-y-2">
            <Input
              placeholder="Título da conversa"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateConversation()}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleCreateConversation}>
                Criar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setNewTitle("");
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma conversa ainda</p>
              <p className="text-sm">Clique em + para começar</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="group relative">
                  <Link to={`/chat/${conversation.id}`}>
                    <div className={`
                      p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors
                      ${chatId === conversation.id ? 'bg-primary/10 border border-primary/20' : ''}
                    `}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(conversation.updated_at || conversation.created_at || '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
