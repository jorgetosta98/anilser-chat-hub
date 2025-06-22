
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Smartphone, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Conexoes() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              Conecte seu número de telefone e converse com o safeboy diretamente pelo seu Whatsapp
            </p>
            
            <Button 
              className="bg-primary hover:bg-primary-700 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Conectar meu número
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="mt-6 text-center text-gray-500">
              <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Funcionalidade em desenvolvimento</p>
              <p className="text-sm">Em breve você poderá conectar seu WhatsApp</p>
            </div>
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
              <DialogTitle>Nova Conexão</DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center">
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
              <p className="text-gray-600 mb-4">
                A funcionalidade de conexões está sendo desenvolvida e estará disponível em breve.
              </p>
              <Button onClick={() => setIsModalOpen(false)}>
                Entendi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
