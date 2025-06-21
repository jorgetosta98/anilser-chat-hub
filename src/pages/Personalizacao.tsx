
import { useState } from "react";
import { Upload, Palette, Sun, Moon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const colorPresets = [
  { name: "Verde Safeboy", primary: "#0d9488", secondary: "#14b8a6" },
  { name: "Azul Profissional", primary: "#2563eb", secondary: "#3b82f6" },
  { name: "Roxo Moderno", primary: "#7c3aed", secondary: "#8b5cf6" },
  { name: "Vermelho Energia", primary: "#dc2626", secondary: "#ef4444" },
  { name: "Laranja Criativo", primary: "#ea580c", secondary: "#f97316" },
  { name: "Rosa Elegante", primary: "#e11d48", secondary: "#f43f5e" },
];

export default function Personalizacao() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
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
      setCustomLogo(e.target?.result as string);
      toast({
        title: "Logo atualizado!",
        description: "Seu novo logo foi salvo com sucesso.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências de personalização foram aplicadas.",
    });
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalização</h1>
          <p className="text-gray-600">
            Customize a aparência do aplicativo de acordo com sua marca
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logo Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Logo da Empresa</span>
              </CardTitle>
              <CardDescription>
                Faça upload do seu logo (máx. 2MB, PNG/JPG recomendado)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {customLogo ? (
                  <div className="space-y-4">
                    <img
                      src={customLogo}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload">
                <Button variant="outline" className="w-full cursor-pointer">
                  {customLogo ? "Alterar Logo" : "Enviar Logo"}
                </Button>
              </label>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="w-5 h-5" />
                <span>Tema</span>
              </CardTitle>
              <CardDescription>
                Escolha entre modo claro ou escuro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4" />
                  <Label htmlFor="dark-mode">Modo Escuro</Label>
                  <Moon className="w-4 h-4" />
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>
              <div className="p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Preview do tema:</p>
                <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border`}>
                  <p className="font-medium">Exemplo de texto</p>
                  <p className="text-sm opacity-70">Este é um exemplo de como o tema ficará</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Cores do Sistema</span>
              </CardTitle>
              <CardDescription>
                Selecione as cores que representam sua marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Presets de Cores</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorPresets.map((preset) => (
                    <div
                      key={preset.name}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedColor.name === preset.name
                          ? 'border-gray-400 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedColor(preset)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <p className="text-sm font-medium mt-2">{preset.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="color"
                      id="primary-color"
                      value={selectedColor.primary}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      type="text"
                      value={selectedColor.primary}
                      className="flex-1"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="color"
                      id="secondary-color"
                      value={selectedColor.secondary}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      type="text"
                      value={selectedColor.secondary}
                      className="flex-1"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Preview das cores:</p>
                <div className="flex space-x-2">
                  <Button style={{ backgroundColor: selectedColor.primary }}>
                    Botão Primário
                  </Button>
                  <Button variant="outline" style={{ borderColor: selectedColor.secondary, color: selectedColor.secondary }}>
                    Botão Secundário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} className="px-8">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
