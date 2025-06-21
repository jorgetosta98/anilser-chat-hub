
import { useState } from "react";
import { Upload, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LogoUploaderProps {
  currentLogo: string | null;
  onLogoChange: (logo: string | null) => void;
  uploadLogo: (file: File) => Promise<string | null>;
}

export function LogoUploader({ currentLogo, onLogoChange, uploadLogo }: LogoUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O logo deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (PNG, JPG, etc.).",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      const logoUrl = await uploadLogo(file);
      if (logoUrl) {
        onLogoChange(logoUrl);
        toast({
          title: "Logo atualizado!",
          description: "Seu novo logo foi salvo com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer upload da logo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    toast({
      title: "Logo removido",
      description: "O logo foi removido com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        {currentLogo ? (
          <div className="space-y-4">
            <img
              src={currentLogo}
              alt="Logo customizado"
              className="max-h-24 mx-auto rounded"
              onError={(e) => {
                console.error('Erro ao carregar imagem:', e);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">Logo atual</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Logo padrão</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
          id="logo-upload"
          disabled={uploading}
        />
        <label htmlFor="logo-upload" className="flex-1">
          <Button 
            variant="outline" 
            className="w-full cursor-pointer" 
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? "Enviando..." : currentLogo ? "Alterar Logo" : "Enviar Logo"}
            </span>
          </Button>
        </label>
        
        {currentLogo && !uploading && (
          <Button variant="destructive" onClick={handleRemoveLogo}>
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}
