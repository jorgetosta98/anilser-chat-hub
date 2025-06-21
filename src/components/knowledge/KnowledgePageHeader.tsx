
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KnowledgePageHeaderProps {
  onCreateDocument: () => void;
}

export function KnowledgePageHeader({ onCreateDocument }: KnowledgePageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Base de Conhecimento</h1>
        <p className="text-gray-600">
          Gerencie documentos, procedimentos e informações para melhorar a precisão das respostas da IA
        </p>
      </div>
      <Button onClick={onCreateDocument}>
        <Plus className="w-4 h-4 mr-2" />
        Novo Documento
      </Button>
    </div>
  );
}
