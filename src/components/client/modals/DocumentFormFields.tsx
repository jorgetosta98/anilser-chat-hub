
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface DocumentFormFieldsProps {
  title: string;
  summary: string;
  content: string;
  context: string;
  categoryId: string;
  isPublic: boolean;
  categories: Category[];
  hasFile: boolean;
  onTitleChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPublicChange: (value: boolean) => void;
}

export function DocumentFormFields({
  title,
  summary,
  content,
  context,
  categoryId,
  isPublic,
  categories,
  hasFile,
  onTitleChange,
  onSummaryChange,
  onContentChange,
  onContextChange,
  onCategoryChange,
  onPublicChange,
}: DocumentFormFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="title" className="text-sm font-medium">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Digite o título do documento"
          required
          className="mt-1 h-8"
        />
      </div>

      <div>
        <Label htmlFor="summary" className="text-sm font-medium">Resumo</Label>
        <Input
          id="summary"
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Breve resumo"
          className="mt-1 h-8"
        />
      </div>

      <div>
        <Label htmlFor="category" className="text-sm font-medium">Categoria</Label>
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className="mt-1 h-8">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFile ? (
        <div>
          <Label htmlFor="context" className="text-sm font-medium">Contexto</Label>
          <Textarea
            id="context"
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="Adicione contexto adicional sobre o documento (opcional)"
            className="min-h-[60px] max-h-[120px] mt-1 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            O conteúdo será extraído automaticamente do arquivo.
          </p>
        </div>
      ) : (
        <div>
          <Label htmlFor="content" className="text-sm font-medium">Conteúdo *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Digite o conteúdo do documento"
            className="min-h-[100px] max-h-[200px] mt-1 text-sm"
            required
          />
        </div>
      )}

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="is_public"
          checked={isPublic}
          onChange={(e) => onPublicChange(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="is_public" className="text-sm font-medium">Documento público</Label>
      </div>
    </>
  );
}
