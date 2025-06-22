
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Bot, Power } from 'lucide-react';
import { useChatbotInstructions } from '@/hooks/useChatbotInstructions';
import { ChatbotInstructionsModal } from '@/components/modals/ChatbotInstructionsModal';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

export default function InstrucoesChatbot() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const {
    instructions,
    activeInstruction,
    isLoading,
    createInstruction,
    updateInstruction,
    deleteInstruction,
    activateInstruction,
  } = useChatbotInstructions();

  const handleSave = async (data: any) => {
    if (editingInstruction) {
      await updateInstruction(editingInstruction.id, data);
    } else {
      await createInstruction(data);
    }
  };

  const handleEdit = (instruction: any) => {
    setEditingInstruction(instruction);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingInstruction(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteInstruction(id);
    setDeleteConfirmation({ isOpen: false, id: null });
  };

  const handleActivate = async (id: string) => {
    await activateInstruction(id);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instruções do Chatbot
            </h1>
            <p className="text-gray-600">
              Personalize como o SafeBoy deve se comportar e responder
            </p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Instrução
          </Button>
        </div>

        {/* Active Instruction Summary */}
        {activeInstruction && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-600" />
                <CardTitle className="text-green-800">Instrução Ativa</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Ativo
                </Badge>
              </div>
              <CardDescription className="text-green-700">
                <strong>{activeInstruction.persona_name}</strong>
                {activeInstruction.persona_description && 
                  ` - ${activeInstruction.persona_description}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-800 line-clamp-3">
                {activeInstruction.instructions}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Instructions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando instruções...</p>
            </div>
          ) : instructions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma instrução criada
                </h3>
                <p className="text-gray-500 mb-4">
                  Crie sua primeira instrução para personalizar o comportamento do chatbot
                </p>
                <Button onClick={handleCreate}>
                  Criar primeira instrução
                </Button>
              </CardContent>
            </Card>
          ) : (
            instructions.map((instruction) => (
              <Card key={instruction.id} className={instruction.is_active ? 'border-blue-200' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {instruction.persona_name}
                      </CardTitle>
                      {instruction.is_active && (
                        <Badge variant="default">Ativo</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!instruction.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivate(instruction.id)}
                        >
                          <Power className="w-4 h-4" />
                          Ativar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(instruction)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirmation({ isOpen: true, id: instruction.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {instruction.persona_description && (
                    <CardDescription>{instruction.persona_description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Instruções:</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {instruction.instructions}
                      </p>
                    </div>
                    {instruction.additional_context && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Contexto Adicional:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {instruction.additional_context}
                        </p>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Criado em {new Date(instruction.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal */}
        <ChatbotInstructionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          instruction={editingInstruction}
          onSave={handleSave}
        />

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
          onConfirm={() => deleteConfirmation.id && handleDelete(deleteConfirmation.id)}
          title="Excluir Instrução"
          description="Tem certeza que deseja excluir esta instrução? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      </div>
    </div>
  );
}
