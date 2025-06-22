
import { useState, useEffect } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Smartphone, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [instanceId, setInstanceId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const { toast } = useToast();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhoneNumber("");
      setConnectionName("");
      setQrCode("");
      setInstanceId("");
      setConnectionStatus("disconnected");
    }
  }, [isOpen]);

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
      // Create WhatsApp instance
      const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
        body: {
          action: 'create_instance',
          connectionData: {
            name: connectionName,
            phone: phoneNumber
          }
        }
      });

      if (error) {
        console.error('Error creating instance:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar conexão WhatsApp",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        setInstanceId(data.instanceId);
        setStep(2);
        // Get QR code
        await getQRCode(data.instanceId);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar conexão",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getQRCode = async (instanceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
        body: {
          action: 'get_qr_code',
          connectionData: { instanceId }
        }
      });

      if (error) {
        console.error('Error getting QR code:', error);
        return;
      }

      if (data?.success && data.qrCode) {
        setQrCode(data.qrCode);
        // Start checking connection status
        startStatusCheck(instanceId);
      }
    } catch (error) {
      console.error('Error getting QR code:', error);
    }
  };

  const startStatusCheck = (instanceId: string) => {
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
          body: {
            action: 'check_status',
            connectionData: { instanceId }
          }
        });

        if (error) {
          console.error('Error checking status:', error);
          return;
        }

        if (data?.connected) {
          setConnectionStatus("connected");
          setStep(3);
          setTimeout(() => {
            onConnect({
              id: instanceId,
              name: connectionName,
              phone: phoneNumber,
              status: "connected",
              connectedAt: new Date().toISOString()
            });
            toast({
              title: "Sucesso",
              description: "WhatsApp conectado com sucesso!"
            });
            onClose();
          }, 2000);
        } else {
          // Continue checking every 3 seconds
          setTimeout(() => checkStatus(), 3000);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    // Start checking after 2 seconds
    setTimeout(checkStatus, 2000);
  };

  const refreshQRCode = async () => {
    if (!instanceId) return;
    
    setIsLoading(true);
    await getQRCode(instanceId);
    setIsLoading(false);
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
                    <img 
                      src={`data:image/png;base64,${qrCode}`} 
                      alt="QR Code" 
                      className="w-48 h-48 border rounded"
                    />
                    <Button 
                      onClick={refreshQRCode} 
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
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded mx-auto">
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

            {connectionStatus === "connecting" && (
              <div className="bg-blue-50 p-3 rounded text-sm">
                <p className="text-blue-800">
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Aguardando conexão...
                </p>
              </div>
            )}
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
