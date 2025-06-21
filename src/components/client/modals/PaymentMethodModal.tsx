
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCard?: {
    last4: string;
    brand: string;
    expiryMonth: string;
    expiryYear: string;
  };
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  currentCard
}: PaymentMethodModalProps) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setFormData({...formData, cardNumber: formatCardNumber(value)});
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.cardNumber || !formData.cardName || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Cartão atualizado",
        description: "Seu método de pagamento foi atualizado com sucesso.",
      });
      
      setFormData({
        cardNumber: "",
        cardName: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: ""
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar seu cartão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 15}, (_, i) => currentYear + i);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Alterar Cartão de Crédito"
      onSubmit={handleSubmit}
      submitText="Salvar Cartão"
      isLoading={isLoading}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {currentCard && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Cartão atual:</p>
            <p className="font-medium">**** **** **** {currentCard.last4}</p>
            <p className="text-sm text-gray-600">Válido até {currentCard.expiryMonth}/{currentCard.expiryYear}</p>
          </div>
        )}
        
        <div>
          <Label htmlFor="cardNumber">Número do cartão *</Label>
          <Input
            id="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
        </div>
        
        <div>
          <Label htmlFor="cardName">Nome no cartão *</Label>
          <Input
            id="cardName"
            type="text"
            value={formData.cardName}
            onChange={(e) => setFormData({...formData, cardName: e.target.value.toUpperCase()})}
            placeholder="NOME COMO APARECE NO CARTÃO"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="expiryMonth">Mês *</Label>
            <Select value={formData.expiryMonth} onValueChange={(value) => setFormData({...formData, expiryMonth: value})}>
              <SelectTrigger>
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                  <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                    {month.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="expiryYear">Ano *</Label>
            <Select value={formData.expiryYear} onValueChange={(value) => setFormData({...formData, expiryYear: value})}>
              <SelectTrigger>
                <SelectValue placeholder="AAAA" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="cvv">CVV *</Label>
            <Input
              id="cvv"
              type="text"
              value={formData.cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 4) {
                  setFormData({...formData, cvv: value});
                }
              }}
              placeholder="123"
              maxLength={4}
            />
          </div>
        </div>
        
        <div className="text-sm text-gray-500 p-3 bg-blue-50 rounded-lg">
          <p><strong>Segurança:</strong> Seus dados de pagamento são protegidos com criptografia de ponta e não são armazenados em nossos servidores.</p>
        </div>
      </div>
    </FormModal>
  );
}
