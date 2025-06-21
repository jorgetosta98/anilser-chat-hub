
import { Upload, Palette, Sun, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { usePersonalization } from "@/hooks/usePersonalization";
import { LogoUploader } from "@/components/personalization/LogoUploader";
import { ThemeSettings } from "@/components/personalization/ThemeSettings";
import { ColorSelection } from "@/components/personalization/ColorSelection";

export default function Personalizacao() {
  const { settings, loading, updateSettings, resetToDefault, uploadLogo } = usePersonalization();

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
                Customize a aparência do aplicativo de acordo com sua marca. 
                <span className="block text-sm text-primary-custom font-medium mt-1">
                  ✓ Configurações salvas automaticamente
                </span>
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
                Selecione as cores que representam sua marca - aplicadas em toda a interface
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

        {/* Info Panel */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">ℹ</span>
            </div>
            <div className="text-sm">
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                Salvamento Automático Ativo
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Todas as suas personalizações são salvas automaticamente no banco de dados 
                e aplicadas imediatamente em toda a interface do sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
