
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportTicketModal({
  isOpen,
  onClose
}: SupportTicketModalProps) {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    attachments: null as File[] | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.subject || !formData.category || !formData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Ticket criado",
        description: "Seu ticket de suporte foi criado com sucesso. Nossa equipe entrará em contato em breve.",
      });
      
      setFormData({
        subject: "",
        category: "",
        priority: "medium",
        description: "",
        attachments: null
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o ticket. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Ticket de Suporte"
      onSubmit={handleSubmit}
      submitText="Criar Ticket"
      isLoading={isLoading}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="subject">Assunto *</Label>
          <Input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            placeholder="Descreva brevemente o problema"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Problema Técnico</SelectItem>
                <SelectItem value="billing">Faturamento</SelectItem>
                <SelectItem value="feature">Solicitação de Recurso</SelectItem>
                <SelectItem value="integration">Integração WhatsApp</SelectItem>
                <SelectItem value="account">Gerenciamento de Conta</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Prioridade</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData({...formData, priority: value})}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Descrição detalhada *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Descreva o problema em detalhes, incluindo passos para reproduzir o erro, mensagens de erro, etc."
            className="mt-2"
            rows={4}
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Informações úteis para incluir:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Passos detalhados para reproduzir o problema</li>
            <li>• Mensagens de erro exatas</li>
            <li>• Navegador e versão utilizada</li>
            <li>• Horário aproximado quando o problema ocorreu</li>
            <li>• Screenshots ou capturas de tela (se aplicável)</li>
          </ul>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>* Campos obrigatórios</p>
          <p>Tempo médio de resposta: 24 horas para tickets de prioridade média, 4 horas para alta prioridade.</p>
        </div>
      </div>
    </FormModal>
  );
}
