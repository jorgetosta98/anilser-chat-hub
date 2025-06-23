
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Smartphone, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WhatsAppConnectionForm } from "@/components/forms/WhatsAppConnectionForm";
import { WhatsAppQRCode } from "@/components/WhatsAppQRCode";
import { useWhatsAppConnections } from "@/hooks/useWhatsAppConnections";
import { Badge } from "@/components/ui/badge";

export default function Conexoes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connections, isLoading, qrCode, countdown, fetchConnections, createConnection, deleteConnection, clearQRCode } = useWhatsAppConnections();

  console.log('Conexoes render - qrCode:', qrCode ? 'presente' : 'vazio');
  console.log('Conexoes render - countdown:', countdown);

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleConnectionSuccess = () => {
    console.log('handleConnectionSuccess chamado - qrCode:', qrCode ? 'presente' : 'vazio');
    // Don't close modal immediately when QR code is shown
    if (!qrCode) {
      setIsModalOpen(false);
    }
    fetchConnections();
  };

  const handleDeleteConnection = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta conexão?')) {
      await deleteConnection(id);
    }
  };

  const handleCloseQRCode = () => {
    console.log('handleCloseQRCode chamado');
    clearQRCode();
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      connected: { color: 'bg-green-100 text-green-800', text: 'Conectado' },
      conectando: { color: 'bg-blue-100 text-blue-800', text: 'Conectando' },
      disconnected: { color: 'bg-gray-100 text-gray-800', text: 'Desconectado' },
      desconectado: { color: 'bg-red-100 text-red-800', text: 'Desconectado' },
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Conexões</h1>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Conexão
          </Button>
        </div>
        
        <Card className="shadow-sm border border-gray-200" style={{ backgroundColor: '#F9FAFB' }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl text-gray-900">WhatsApp</span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Conecte seu número de telefone e converse com o assistente diretamente pelo seu WhatsApp
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {connections.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 p-3 bg-gray-100 rounded-full">
                  <Smartphone className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma conexão configurada
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Configure sua primeira conexão WhatsApp para começar a usar o assistente
                </p>
                <Button 
                  className="bg-primary hover:bg-primary-700 text-white px-6 py-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Conectar meu número
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Suas Conexões</h3>
                </div>
                
                <div className="grid gap-3">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{connection.instance_name}</p>
                          <p className="text-sm text-gray-600">{connection.whatsapp_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(connection.status || 'pending')}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteConnection(connection.id!)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Conexão WhatsApp</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <WhatsAppConnectionForm 
                onSuccess={handleConnectionSuccess}
                createConnection={createConnection}
                isLoading={isLoading}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Code Modal */}
        {qrCode && (
          <WhatsAppQRCode 
            qrCode={qrCode}
            countdown={countdown}
            onClose={handleCloseQRCode}
          />
        )}
      </div>
    </div>
  );
}
