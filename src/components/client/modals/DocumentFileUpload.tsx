
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentFileUploadProps {
  uploadedFile: File | null;
  existingFileUrl?: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export function DocumentFileUpload({ 
  uploadedFile, 
  existingFileUrl, 
  onFileSelect, 
  onFileRemove 
}: DocumentFileUploadProps) {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: "Por favor, selecione um arquivo PDF, DOC, DOCX, TXT ou CSV.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    onFileSelect(file);

    toast({
      title: "Arquivo selecionado",
      description: `${file.name} está pronto para upload.`,
    });
  };

  const hasUploadedFile = uploadedFile || existingFileUrl;

  return (
    <div>
      <Label className="text-sm font-medium">Upload de Documento</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 mt-1">
        {hasUploadedFile ? (
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-xs">
                {uploadedFile?.name || (existingFileUrl ? "Arquivo já carregado" : "")}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-2">
            <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-600 mb-1">
              Arraste um arquivo aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500 mb-2">
              PDF, DOC, DOCX, TXT, CSV (máx. 10MB)
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.csv"
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="h-7 text-xs"
            >
              Selecionar Arquivo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
