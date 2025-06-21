
import { Calendar, Eye, Tag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DocumentCategory {
  name: string;
  color: string;
}

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category_id?: string;
  category?: DocumentCategory;
  tags: string[];
  file_url?: string;
  file_type?: string;
  is_public: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

interface DocumentItemProps {
  document: KnowledgeDocument;
  onEdit: (document: KnowledgeDocument) => void;
  onDelete: (id: string) => void;
}

export function DocumentItem({ document, onEdit, onDelete }: DocumentItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-medium text-gray-900">{document.title}</h3>
          {document.category && (
            <Badge 
              variant="secondary" 
              style={{ backgroundColor: `${document.category.color}20`, color: document.category.color }}
            >
              {document.category.name}
            </Badge>
          )}
          {!document.is_public && (
            <Badge variant="outline">Privado</Badge>
          )}
        </div>
        
        {document.summary && (
          <p className="text-sm text-gray-600 mb-2">{document.summary}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(document.created_at)}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {document.views_count} visualizações
          </div>
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {document.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 ml-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(document)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(document.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
