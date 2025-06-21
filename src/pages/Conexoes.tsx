import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Smartphone } from "lucide-react";

export default function Conexoes() {
  return (
    <div className="flex-1 p-6" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Conexões</h1>
        
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
            
            <Button className="bg-primary hover:bg-primary-700 text-white">
              Conectar meu número
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Empty state for other connections */}
        <div className="mt-8 text-center text-gray-500">
          <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Mais opções de conexão em breve...</p>
        </div>
      </div>
    </div>
  );
}
