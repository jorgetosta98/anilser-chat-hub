
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone } from "lucide-react";
import { useEffect, useRef } from "react";

interface ConnectionNameStepProps {
  connectionName: string;
  onConnectionNameChange: (name: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phone: string) => void;
}

export function ConnectionNameStep({ 
  connectionName, 
  onConnectionNameChange, 
  phoneNumber, 
  onPhoneNumberChange 
}: ConnectionNameStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus no input quando o componente monta
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Input value changed:', value);
    onConnectionNameChange(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Phone number changed:', value);
    onPhoneNumberChange(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="connectionName">Nome da Conexão *</Label>
        <Input
          ref={inputRef}
          id="connectionName"
          value={connectionName}
          onChange={handleNameChange}
          placeholder="Ex: Atendimento Principal"
          className="mt-1"
          autoComplete="off"
          autoFocus
        />
        <p className="text-sm text-muted-foreground mt-1">
          Este nome ajudará você a identificar a conexão
        </p>
      </div>

      <div>
        <Label htmlFor="phoneNumber">Número de Telefone *</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Ex: +5511999999999"
          className="mt-1"
          autoComplete="off"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Número de telefone que será conectado ao WhatsApp
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Como funciona:</p>
            <p className="text-blue-700 mt-1">
              1. Informe o nome e número para identificar esta conexão<br/>
              2. O sistema criará uma instância e gerará o QR code<br/>
              3. Escaneie o código QR com seu WhatsApp<br/>
              4. Aguarde a confirmação da conexão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
