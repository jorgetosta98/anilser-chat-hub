
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Smartphone, Plus, Trash2, Power, PowerOff } from "lucide-react";
import { useState } from "react";
import { WhatsAppConnectionModal } from "@/components/client/modals/whatsapp/WhatsAppConnectionModal";
import { useWhatsAppConnections } from "@/hooks/useWhatsAppConnections";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Conexoes() {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const { connections, loading, disconnectConnection, deleteConnection, refreshConnections } = useWhatsAppConnections();

  const handleNewConnection = () => {
    // Refresh connections after new connection is added
    refreshConnections();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Desconectado</Badge>;
      case 'qr_generated':
      case 'qr_updated':
        return <Badge className="bg-yellow-100 text-yellow-800">Aguardando QR</Badge>;
      case 'created':
        return <Badge className="bg-blue-100 text-blue-800">Criado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="flex-1 p-6" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Conexões</h1>
          <Button onClick={() => setIsWhatsAppModalOpen(true)}>
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
              Conecte seu número de telefone e converse com o safeboy diretamente pelo seu Whatsapp
            </p>
            
            <Button 
              className="bg-primary hover:bg-primary-700 text-white"
              onClick={() => setIsWhatsAppModalOpen(true)}
            >
              Conectar meu número
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {loading ? (
              <div className="text-center py-4">
                <p>Carregando conexões...</p>
              </div>
            ) : connections.length > 0 ? (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Conexões:</h3>
                <div className="space-y-3">
                  {connections.map((conn) => (
                    <div key={conn.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{conn.name}</h4>
                          {getStatusBadge(conn.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{conn.phone}</p>
                        <p className="text-xs text-gray-500">
                          Criado em: {formatDate(conn.created_at)}
                        </p>
                        {conn.connected_at && (
                          <p className="text-xs text-gray-500">
                            Conectado em: {formatDate(conn.connected_at)}
                          </p>
                        )}
                        {conn.last_seen && (
                          <p className="text-xs text-gray-500">
                            Último acesso: {formatDate(conn.last_seen)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {conn.status === 'connected' ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <PowerOff className="w-4 h-4 mr-1" />
                                Desconectar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Desconectar WhatsApp</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja desconectar este WhatsApp? Você precisará escanear o QR code novamente para reconectar.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => disconnectConnection(conn.instance_id)}>
                                  Desconectar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsWhatsAppModalOpen(true)}
                          >
                            <Power className="w-4 h-4 mr-1" />
                            Reconectar
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Conexão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta conexão? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteConnection(conn.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center text-gray-500">
                <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conexão WhatsApp encontrada</p>
                <p className="text-sm">Clique em "Conectar meu número" para começar</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty state for other connections */}
        <div className="mt-8 text-center text-gray-500">
          <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Mais opções de conexão em breve...</p>
        </div>

        <WhatsAppConnectionModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          onConnect={handleNewConnection}
        />
      </div>
    </div>
  );
}
