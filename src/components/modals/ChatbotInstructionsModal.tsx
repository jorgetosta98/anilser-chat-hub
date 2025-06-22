
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { ChatbotInstruction } from '@/hooks/useChatbotInstructions';

const instructionSchema = z.object({
  persona_name: z.string().min(1, 'Nome da persona é obrigatório').max(50, 'Nome muito longo'),
  persona_description: z.string().optional(),
  instructions: z.string().min(10, 'Instruções devem ter pelo menos 10 caracteres'),
  additional_context: z.string().optional(),
  is_active: z.boolean(),
});

type InstructionFormData = z.infer<typeof instructionSchema>;

interface ChatbotInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruction?: ChatbotInstruction | null;
  onSave: (data: InstructionFormData) => Promise<void>;
}

export function ChatbotInstructionsModal({
  isOpen,
  onClose,
  instruction,
  onSave,
}: ChatbotInstructionsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InstructionFormData>({
    resolver: zodResolver(instructionSchema),
    defaultValues: {
      persona_name: 'SafeBoy',
      persona_description: '',
      instructions: '',
      additional_context: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (instruction) {
      form.reset({
        persona_name: instruction.persona_name || 'SafeBoy',
        persona_description: instruction.persona_description || '',
        instructions: instruction.instructions,
        additional_context: instruction.additional_context || '',
        is_active: instruction.is_active,
      });
    } else {
      form.reset({
        persona_name: 'SafeBoy',
        persona_description: '',
        instructions: '',
        additional_context: '',
        is_active: true,
      });
    }
  }, [instruction, form]);

  const handleSubmit = async (data: InstructionFormData) => {
    setIsLoading(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving instruction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {instruction ? 'Editar Instruções do Chatbot' : 'Criar Instruções do Chatbot'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="persona_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Persona</FormLabel>
                    <FormControl>
                      <Input placeholder="SafeBoy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Ativar</FormLabel>
                      <FormDescription>
                        Usar estas instruções no chat
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="persona_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Persona (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva como o chatbot deve se comportar..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruções Principais *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Defina como o chatbot deve responder, que tom usar, que informações priorizar..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Estas instruções definem o comportamento principal do chatbot
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additional_context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contexto Adicional (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações específicas da sua empresa, políticas internas, etc..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Contexto específico que deve ser considerado nas respostas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
