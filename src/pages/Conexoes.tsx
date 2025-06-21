
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Smartphone, Plus } from "lucide-react";
import { useState } from "react";
import { WhatsAppConnectionModal } from "@/components/client/modals/WhatsAppConnectionModal";

export default function Conexoes() {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);

  const handleNewConnection = (connectionData: any) => {
    setConnections(prev => [...prev, connectionData]);
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

            {connections.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Conexões Ativas:</h3>
                <div className="space-y-2">
                  {connections.map((conn, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">{conn.name}</p>
                        <p className="text-sm text-gray-600">{conn.phone}</p>
                      </div>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                        Conectado
                      </span>
                    </div>
                  ))}
                </div>
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
