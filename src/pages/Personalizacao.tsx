
import { Upload, Palette, Sun, Settings, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePersonalization } from "@/hooks/usePersonalization";
import { LogoUploader } from "@/components/personalization/LogoUploader";
import { ThemeSettings } from "@/components/personalization/ThemeSettings";
import { ColorSelection } from "@/components/personalization/ColorSelection";
import { Loader2 } from "lucide-react";

export default function Personalizacao() {
  const { settings, loading, updateSettings, saveSettings, resetToDefault, uploadLogo } = usePersonalization();

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  const handleColorPresetSelect = (preset: { name: string; primary: string; secondary: string }) => {
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
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Personalização</h1>
              <p className="text-gray-600 dark:text-gray-400">
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
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Upload className="w-5 h-5" />
                <span>Logo da Empresa</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Faça upload do seu logo (máx. 2MB, PNG/JPG recomendado)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogoUploader
                currentLogo={settings.customLogo}
                onLogoChange={(logo) => updateSettings({ customLogo: logo })}
                uploadLogo={uploadLogo}
              />
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Sun className="w-5 h-5" />
                <span>Tema</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Escolha entre modo claro ou escuro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSettings
                isDarkMode={settings.isDarkMode}
                onThemeChange={(isDarkMode) => updateSettings({ isDarkMode })}
              />
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Palette className="w-5 h-5" />
                <span>Cores do Sistema</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Selecione as cores que representam sua marca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColorSelection
                selectedColor={settings.selectedColor}
                onColorPresetSelect={handleColorPresetSelect}
                onCustomColorChange={handleCustomColorChange}
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
