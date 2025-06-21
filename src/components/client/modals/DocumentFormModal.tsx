
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id?: string;
  name: string;
  description: string;
  category: string;
  content?: string;
  file?: File;
  tags: string[];
}

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: Document;
  onSave: (document: Document) => void;
}

export function DocumentFormModal({ isOpen, onClose, document, onSave }: DocumentFormModalProps) {
  const [formData, setFormData] = useState<Document>({
    name: document?.name || "",
    description: document?.description || "",
    category: document?.category || "geral",
    content: document?.content || "",
    tags: document?.tags || []
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: "geral", label: "Geral" },
    { value: "procedimentos", label: "Procedimentos" },
    { value: "politicas", label: "Políticas" },
    { value: "faq", label: "FAQ" },
    { value: "manuais", label: "Manuais" },
    { value: "contratos", label: "Contratos" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Limite de 10MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async () => {
    if (!formData.name || (!formData.content && !selectedFile)) {
      toast({
        title: "Erro",
        description: "Nome e conteúdo (texto ou arquivo) são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular upload/processamento
      
      const documentToSave = {
        ...formData,
        id: document?.id || Date.now().toString(),
        file: selectedFile || undefined
      };
      
      onSave(documentToSave);
      toast({
        title: "Sucesso",
        description: document ? "Documento atualizado com sucesso" : "Documento criado com sucesso"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o documento",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={document ? "Editar Documento" : "Novo Documento"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome do Documento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Manual de Atendimento"
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva brevemente o conteúdo do documento"
            rows={3}
          />
        </div>

        <div>
          <Label>Conteúdo</Label>
          <div className="space-y-4">
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Digite o conteúdo do documento aqui..."
              rows={6}
            />
            
            <div className="text-center text-sm text-muted-foreground">ou</div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Faça upload de um arquivo</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Selecionar Arquivo
                </Button>
              </label>
              {selectedFile && (
                <div className="mt-3 flex items-center justify-center space-x-2">
                  <File className="w-4 h-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                Adicionar
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-primary/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </FormModal>
  );
}
