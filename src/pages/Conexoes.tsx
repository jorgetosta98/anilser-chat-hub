
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Smartphone, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WhatsAppConnectionForm } from "@/components/forms/WhatsAppConnectionForm";
import { useWhatsAppConnections } from "@/hooks/useWhatsAppConnections";
import { Badge } from "@/components/ui/badge";

export default function Conexoes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connections, isLoading, fetchConnections, deleteConnection } = useWhatsAppConnections();

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleConnectionSuccess = () => {
    setIsModalOpen(false);
    fetchConnections();
  };

  const handleDeleteConnection = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta conexão?')) {
      await deleteConnection(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      connected: { color: 'bg-green-100 text-green-800', text: 'Conectado' },
      disconnected: { color: 'bg-gray-100 text-gray-800', text: 'Desconectado' },
      error: { color: 'bg-red-100 text-red-800', text: 'Erro' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="flex-1 p-6" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Conexões</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Conexão
          </Button>
        </div>
        
        <Card className="bg-primary-50 border-primary-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">WhatsApp</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Conecte seu número de telefone e converse com o assistente diretamente pelo seu WhatsApp
            </p>
            
            {connections.length === 0 ? (
              <>
                <Button 
                  className="bg-primary hover:bg-primary-700 text-white"
                  onClick={() => setIsModalOpen(true)}
                >
                  Conectar meu número
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="mt-6 text-center text-gray-500">
                  <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conexão configurada</p>
                  <p className="text-sm">Clique em "Conectar meu número" para começar</p>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Suas Conexões:</h3>
                {connections.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium text-gray-900">{connection.instance_name}</p>
                          <p className="text-sm text-gray-500">{connection.whatsapp_number}</p>
                        </div>
                        {getStatusBadge(connection.status || 'pending')}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConnection(connection.id!)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nova Conexão
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty state for other connections */}
        <div className="mt-8 text-center text-gray-500">
          <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Mais opções de conexão em breve...</p>
        </div>

        {/* Modal Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Conexão WhatsApp</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <WhatsAppConnectionForm onSuccess={handleConnectionSuccess} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
