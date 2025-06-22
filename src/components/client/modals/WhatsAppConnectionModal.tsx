
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
  const [step, setStep] = useState(1); // 1: Nome, 2: QR Code, 3: Sucesso
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
      setConnectionName("");
      setQrCode("");
      setInstanceId("");
      setConnectionStatus("disconnected");
    }
  }, [isOpen]);

  const handleStartConnection = async () => {
    if (!connectionName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da conexão é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Criando instância WhatsApp com nome:', connectionName);
      
      // Criar instância WhatsApp na Evolution API
      const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
        body: {
          action: 'create_instance',
          connectionData: {
            name: connectionName,
            phone: '' // Não precisamos do número ainda, será detectado após conexão
          }
        }
      });

      if (error) {
        console.error('Erro ao criar instância:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar conexão WhatsApp",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        console.log('Instância criada com sucesso:', data.instanceId);
        setInstanceId(data.instanceId);
        setStep(2);
        
        // Aguardar um pouco e então buscar o QR code
        setTimeout(async () => {
          await getQRCode(data.instanceId);
        }, 2000);
      }
    } catch (error) {
      console.error('Erro:', error);
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
      console.log('Buscando QR code para instância:', instanceId);
      
      const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
        body: {
          action: 'get_qr_code',
          connectionData: { instanceId }
        }
      });

      if (error) {
        console.error('Erro ao buscar QR code:', error);
        toast({
          title: "Erro",
          description: "Erro ao gerar QR code",
          variant: "destructive"
        });
        return;
      }

      if (data?.success && data.qrCode) {
        console.log('QR code recebido');
        setQrCode(data.qrCode);
        // Iniciar verificação do status de conexão
        startStatusCheck(instanceId);
      } else {
        // Tentar novamente após alguns segundos
        setTimeout(() => getQRCode(instanceId), 3000);
      }
    } catch (error) {
      console.error('Erro ao buscar QR code:', error);
      // Tentar novamente após alguns segundos
      setTimeout(() => getQRCode(instanceId), 3000);
    }
  };

  const startStatusCheck = (instanceId: string) => {
    console.log('Iniciando verificação de status para:', instanceId);
    
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('whatsapp-connection', {
          body: {
            action: 'check_status',
            connectionData: { instanceId }
          }
        });

        if (error) {
          console.error('Erro ao verificar status:', error);
          return;
        }

        console.log('Status da conexão:', data);

        if (data?.connected) {
          console.log('WhatsApp conectado com sucesso!');
          setConnectionStatus("connected");
          setStep(3);
          
          // Mostrar sucesso por 2 segundos e fechar
          setTimeout(() => {
            onConnect({
              id: instanceId,
              name: connectionName,
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
          // Continuar verificando a cada 3 segundos
          setTimeout(() => checkStatus(), 3000);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        // Continuar verificando mesmo com erro
        setTimeout(() => checkStatus(), 5000);
      }
    };

    // Iniciar verificação após 2 segundos
    setTimeout(checkStatus, 2000);
  };

  const refreshQRCode = async () => {
    if (!instanceId) return;
    
    setIsLoading(true);
    setQrCode("");
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
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Este nome ajudará você a identificar a conexão
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Como funciona:</p>
                  <p className="text-blue-700 mt-1">
                    1. Informe o nome para identificar esta conexão<br/>
                    2. O sistema criará uma instância e gerará o QR code<br/>
                    3. Escaneie o código QR com seu WhatsApp<br/>
                    4. Aguarde a confirmação da conexão
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
                <strong>Status:</strong> Conectado ✅<br/>
                <strong>Instância:</strong> {instanceId}
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded text-sm">
              <p className="text-blue-800">
                Agora você pode enviar mensagens pelo WhatsApp e receber respostas automáticas do SafeBoy!
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
      submitText={step === 1 ? (isLoading ? "Criando..." : "Criar Conexão") : undefined}
      isLoading={isLoading}
      maxWidth="max-w-2xl"
    >
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
    </FormModal>
  );
}
