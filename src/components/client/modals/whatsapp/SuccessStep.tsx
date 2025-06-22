
import { CheckCircle } from "lucide-react";

interface SuccessStepProps {
  connectionName: string;
  instanceId: string;
}

export function SuccessStep({ connectionName, instanceId }: SuccessStepProps) {
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
}
