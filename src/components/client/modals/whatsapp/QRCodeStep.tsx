
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Loader2, RefreshCw } from "lucide-react";

interface QRCodeStepProps {
  qrCode: string;
  isLoading: boolean;
  onRefreshQRCode: () => void;
}

export function QRCodeStep({ qrCode, isLoading, onRefreshQRCode }: QRCodeStepProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <QrCode className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">Escaneie o código QR</h3>
      <p className="text-sm text-muted-foreground">
        Abra o WhatsApp no seu celular e escaneie o código QR abaixo
      </p>
      
      <Card className="p-4">
        <CardContent className="p-0">
          {qrCode ? (
            <div className="flex flex-col items-center space-y-4">
              <img 
                src={`data:image/png;base64,${qrCode}`} 
                alt="QR Code" 
                className="w-64 h-64 border rounded"
              />
              <Button 
                onClick={onRefreshQRCode} 
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar QR Code
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="w-64 h-64 bg-gray-100 flex flex-col items-center justify-center rounded mx-auto">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Gerando QR Code...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-yellow-50 p-3 rounded text-sm">
        <p className="text-yellow-800">
          <strong>Instruções:</strong><br/>
          1. Abra o WhatsApp no seu celular<br/>
          2. Toque nos três pontos (⋮) no canto superior direito<br/>
          3. Selecione "Aparelhos conectados"<br/>
          4. Toque em "Conectar um aparelho"<br/>
          5. Escaneie este QR code
        </p>
      </div>

      <div className="bg-blue-50 p-3 rounded text-sm">
        <p className="text-blue-800">
          <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
          Aguardando conexão... Mantenha esta janela aberta.
        </p>
      </div>
    </div>
  );
}
