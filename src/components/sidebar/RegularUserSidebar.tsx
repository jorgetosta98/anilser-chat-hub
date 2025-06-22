
import { MessageSquare, Eye, EyeOff, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { regularTopMenuItems, regularBottomMenuItems } from "./menuData";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { QuickFeedbackModal } from "../modals/QuickFeedbackModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ConfirmationModal } from "../modals/ConfirmationModal";

interface RegularUserSidebarProps {
  isCollapsed: boolean;
}

export function RegularUserSidebar({ isCollapsed }: RegularUserSidebarProps) {
  const [showRecentChats, setShowRecentChats] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingConversation, setEditingConversation] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  
  const { conversations, updateConversation, deleteConversation } = useConversations();
  const navigate = useNavigate();
  const { chatId } = useParams();
  
  // Buscar mensagens da conversa atual para o modal de feedback
  const { messages } = useMessages(chatId || null);

  const handleNewConversation = async () => {
    // Se há uma conversa ativa, mostrar modal de avaliação primeiro
    if (chatId && messages && messages.length > 0) {
      setShowFeedbackModal(true);
    } else {
      // Se não há conversa ativa, ir diretamente para a tela inicial
      navigate('/chat');
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    // Após o feedback, redirecionar para a tela inicial
    navigate('/chat');
  };

  const handleEditStart = (conversationId: string, currentTitle: string) => {
    setEditingConversation(conversationId);
    setEditTitle(currentTitle);
    setOpenPopover(null);
  };

  const handleEditSave = () => {
    if (editingConversation && editTitle.trim()) {
      updateConversation({ id: editingConversation, title: editTitle.trim() });
      setEditingConversation(null);
      setEditTitle("");
    }
  };

  const handleEditCancel = () => {
    setEditingConversation(null);
    setEditTitle("");
  };

  const handleDeleteStart = (conversationId: string) => {
    setDeleteConversationId(conversationId);
    setOpenPopover(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteConversationId) {
      deleteConversation(deleteConversationId);
      setDeleteConversationId(null);
      // Se a conversa sendo deletada é a atual, redirecionar para chat
      if (chatId === deleteConversationId) {
        navigate('/chat');
      }
    }
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

  // Obter a última mensagem para personalizar o modal
  const lastMessage = messages && messages.length > 0 
    ? messages[messages.length - 1]?.content 
    : undefined;

  return (
    <>
      {/* Top Menu Items */}
      <div className="p-4 space-y-2 border-b border-sidebar-border">
        <Button
          onClick={handleNewConversation}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-white"
        >
          <MessageSquare className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Nova Conversa</span>}
        </Button>
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
              {conversations.slice(0, 9).map(conversation => (
                <div key={conversation.id} className="group relative">
                  <div 
                    className={`
                      p-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors flex items-center justify-between
                      ${chatId === conversation.id ? 'bg-sidebar-accent border border-sidebar-border' : ''}
                    `}
                    onClick={() => navigate(`/chat/${conversation.id}`)}
                  >
                    <div className="flex items-start min-w-0 flex-1">
                      <MessageSquare className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
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
                          <>
                            <h3 className="font-medium text-sidebar-foreground truncate text-sm">
                              {conversation.title}
                            </h3>
                            <p className="text-xs text-sidebar-foreground/60 mt-1">
                              {formatDate(conversation.updated_at || conversation.created_at || '')}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingConversation !== conversation.id && (
                      <Popover 
                        open={openPopover === conversation.id} 
                        onOpenChange={(open) => setOpenPopover(open ? conversation.id : null)}
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
                              onClick={() => handleEditStart(conversation.id, conversation.title)}
                            >
                              <Edit className="w-3 h-3 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteStart(conversation.id)}
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
              ))}
              {conversations.length === 0 && (
                <div className="text-center py-4 text-sidebar-foreground/70">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma conversa ainda</p>
                </div>
              )}
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

      {/* Modal de Feedback para avaliar conversa anterior */}
      <QuickFeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        conversationId={chatId}
        lastMessage={lastMessage}
      />

      {/* Modal de Confirmação para Exclusão */}
      <ConfirmationModal
        isOpen={!!deleteConversationId}
        onClose={() => setDeleteConversationId(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Conversa"
        description="Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </>
  );
}
