
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (connectionData: any) => void;
}

export function WhatsAppConnectionModal({ isOpen, onClose, onConnect }: WhatsAppConnectionModalProps) {
  const [step, setStep] = useState(1); // 1: Phone, 2: QR Code, 3: Success
  const [phoneNumber, setPhoneNumber] = useState("");
  const [connectionName, setConnectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const { toast } = useToast();

  const handleStartConnection = async () => {
    if (!phoneNumber || !connectionName) {
      toast({
        title: "Erro",
        description: "Número de telefone e nome da conexão são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular API call
      // Simular geração de QR Code
      setQrCode("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0cHgiPkNvZGlnbyBRUjwvdGV4dD48L3N2Zz4=");
      setStep(2);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao iniciar conexão",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateConnection = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStep(3);
      setIsLoading(false);
      setTimeout(() => {
        onConnect({
          id: Date.now(),
          name: connectionName,
          phone: phoneNumber,
          status: "connected",
          connectedAt: new Date().toISOString()
        });
        onClose();
        toast({
          title: "Sucesso",
          description: "WhatsApp conectado com sucesso!"
        });
      }, 2000);
    }, 3000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="connectionName">Nome da Conexão *</Label>
              <Input
                id="connectionName"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
                placeholder="Ex: Atendimento Principal"
              />
            </div>

            <div>
              <Label htmlFor="phone">Número do WhatsApp *</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: +55 11 99999-9999"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Como funciona:</p>
                  <p className="text-blue-700 mt-1">
                    1. Informe o número do WhatsApp que deseja conectar<br/>
                    2. Escaneie o código QR com seu celular<br/>
                    3. Aguarde a confirmação da conexão
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Escaneie o código QR</h3>
            <p className="text-sm text-muted-foreground">
              Use seu celular para escanear o código QR no WhatsApp
            </p>
            
            <Card className="p-4">
              <CardContent className="p-0">
                {qrCode ? (
                  <div className="flex flex-col items-center space-y-4">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48 border rounded" />
                    <Button onClick={simulateConnection} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Aguardando conexão...
                        </>
                      ) : (
                        "Simular Conexão"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-yellow-50 p-3 rounded text-sm">
              <p className="text-yellow-800">
                <strong>Importante:</strong> Mantenha esta janela aberta até confirmar a conexão
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-green-700">Conexão Realizada!</h3>
            <p className="text-sm text-muted-foreground">
              Seu WhatsApp foi conectado com sucesso. Você já pode começar a usar o bot.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg text-left">
              <p className="text-sm text-green-800">
                <strong>Conexão:</strong> {connectionName}<br/>
                <strong>Número:</strong> {phoneNumber}<br/>
                <strong>Status:</strong> Conectado
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Conexão WhatsApp"
      onSubmit={step === 1 ? handleStartConnection : undefined}
      submitText={step === 1 ? (isLoading ? "Iniciando..." : "Iniciar Conexão") : undefined}
      isLoading={isLoading}
      maxWidth="max-w-lg"
    >
      {renderStepContent()}
    </FormModal>
  );
}
