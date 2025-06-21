
import { useState } from "react";
import { Upload, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LogoUploaderProps {
  currentLogo: string | null;
  onLogoChange: (logo: string | null) => void;
}

export function LogoUploader({ currentLogo, onLogoChange }: LogoUploaderProps) {
  const { toast } = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onLogoChange(result);
      toast({
        title: "Logo atualizado!",
        description: "Seu novo logo foi salvo com sucesso.",
      });
    };
    reader.readAsDataURL(file);
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
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {currentLogo ? (
          <div className="space-y-4">
            <img
              src={currentLogo}
              alt="Logo customizado"
              className="max-h-24 mx-auto"
            />
            <p className="text-sm text-gray-600">Logo atual</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-600">Logo padrão</p>
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
        />
        <label htmlFor="logo-upload" className="flex-1">
          <Button variant="outline" className="w-full cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            {currentLogo ? "Alterar Logo" : "Enviar Logo"}
          </Button>
        </label>
        
        {currentLogo && (
          <Button variant="destructive" onClick={handleRemoveLogo}>
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}
