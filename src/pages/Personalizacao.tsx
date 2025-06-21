
import { Upload, Palette, Sun, Moon, Settings, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePersonalization } from "@/hooks/usePersonalization";
import { LogoUploader } from "@/components/personalization/LogoUploader";
import { ThemePreview } from "@/components/personalization/ThemePreview";
import { ColorPreview } from "@/components/personalization/ColorPreview";

const colorPresets = [
  { name: "Verde Safeboy", primary: "#0d9488", secondary: "#14b8a6" },
  { name: "Azul Profissional", primary: "#2563eb", secondary: "#3b82f6" },
  { name: "Roxo Moderno", primary: "#7c3aed", secondary: "#8b5cf6" },
  { name: "Vermelho Energia", primary: "#dc2626", secondary: "#ef4444" },
  { name: "Laranja Criativo", primary: "#ea580c", secondary: "#f97316" },
  { name: "Rosa Elegante", primary: "#e11d48", secondary: "#f43f5e" },
];

export default function Personalizacao() {
  const { settings, updateSettings, saveSettings, resetToDefault } = usePersonalization();

  const handleColorPresetSelect = (preset: typeof colorPresets[0]) => {
    updateSettings({ selectedColor: preset });
  };

  const handleCustomColorChange = (type: 'primary' | 'secondary', color: string) => {
    updateSettings({
      selectedColor: {
        ...settings.selectedColor,
        [type]: color,
        name: 'Personalizado'
      }
    });
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalização</h1>
              <p className="text-gray-600">
                Customize a aparência do aplicativo de acordo com sua marca
              </p>
            </div>
            <Button variant="outline" onClick={resetToDefault}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
          </div>
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
            <CardContent>
              <LogoUploader
                currentLogo={settings.customLogo}
                onLogoChange={(logo) => updateSettings({ customLogo: logo })}
              />
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
                  checked={settings.isDarkMode}
                  onCheckedChange={(checked) => updateSettings({ isDarkMode: checked })}
                />
              </div>
              <ThemePreview isDarkMode={settings.isDarkMode} />
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
                        settings.selectedColor.name === preset.name
                          ? 'border-gray-400 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleColorPresetSelect(preset)}
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
                      value={settings.selectedColor.primary}
                      onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      type="text"
                      value={settings.selectedColor.primary}
                      onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="color"
                      id="secondary-color"
                      value={settings.selectedColor.secondary}
                      onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      type="text"
                      value={settings.selectedColor.secondary}
                      onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <ColorPreview
                primaryColor={settings.selectedColor.primary}
                secondaryColor={settings.selectedColor.secondary}
              />
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={saveSettings} className="px-8">
            <Settings className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
