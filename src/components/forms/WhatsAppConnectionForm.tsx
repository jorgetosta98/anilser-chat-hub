
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWhatsAppConnections } from '@/hooks/useWhatsAppConnections';

interface WhatsAppConnectionFormProps {
  onSuccess?: () => void;
}

export function WhatsAppConnectionForm({ onSuccess }: WhatsAppConnectionFormProps) {
  const [instanceName, setInstanceName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [errors, setErrors] = useState<{ instanceName?: string; whatsappNumber?: string }>({});
  
  const { createConnection, isLoading } = useWhatsAppConnections();

  const validateForm = () => {
    const newErrors: { instanceName?: string; whatsappNumber?: string } = {};

    if (!instanceName.trim()) {
      newErrors.instanceName = 'Nome da instância é obrigatório';
    }

    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'Número do WhatsApp é obrigatório';
    } else if (!/^\d{10,15}$/.test(whatsappNumber.replace(/\D/g, ''))) {
      newErrors.whatsappNumber = 'Número deve ter entre 10 e 15 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const result = await createConnection({
      instance_name: instanceName.trim(),
      whatsapp_number: cleanNumber,
    });

    if (result && onSuccess) {
      // Don't close the modal immediately, let user see the QR code
      setInstanceName('');
      setWhatsappNumber('');
      setErrors({});
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 15) {
      setWhatsappNumber(formatPhoneNumber(value));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="instanceName">Nome da Instância</Label>
        <Input
          id="instanceName"
          type="text"
          placeholder="Ex: Minha Empresa"
          value={instanceName}
          onChange={(e) => setInstanceName(e.target.value)}
          className={errors.instanceName ? 'border-red-500' : ''}
        />
        {errors.instanceName && (
          <p className="text-sm text-red-500">{errors.instanceName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
        <Input
          id="whatsappNumber"
          type="text"
          placeholder="(11) 99999-9999"
          value={whatsappNumber}
          onChange={handlePhoneChange}
          className={errors.whatsappNumber ? 'border-red-500' : ''}
        />
        {errors.whatsappNumber && (
          <p className="text-sm text-red-500">{errors.whatsappNumber}</p>
        )}
        <p className="text-xs text-gray-500">
          Digite apenas os números. Ex: 11999999999
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-700"
        disabled={isLoading}
      >
        {isLoading ? 'Gerando QR Code...' : 'Conectar WhatsApp'}
      </Button>
    </form>
  );
}
