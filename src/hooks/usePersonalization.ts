
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PersonalizationSettings {
  isDarkMode: boolean;
  selectedColor: {
    name: string;
    primary: string;
    secondary: string;
  };
  customLogo: string | null;
}

const defaultSettings: PersonalizationSettings = {
  isDarkMode: false,
  selectedColor: {
    name: "Verde Safeboy",
    primary: "#0d9488",
    secondary: "#14b8a6"
  },
  customLogo: null
};

export function usePersonalization() {
  const [settings, setSettings] = useState<PersonalizationSettings>(defaultSettings);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar configurações do localStorage
    const savedSettings = localStorage.getItem('personalization-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Aplicar tema escuro/claro
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Aplicar cores personalizadas via CSS variables
    document.documentElement.style.setProperty('--primary-color', settings.selectedColor.primary);
    document.documentElement.style.setProperty('--secondary-color', settings.selectedColor.secondary);
  }, [settings]);

  const updateSettings = (newSettings: Partial<PersonalizationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('personalization-settings', JSON.stringify(updatedSettings));
  };

  const saveSettings = () => {
    localStorage.setItem('personalization-settings', JSON.stringify(settings));
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências de personalização foram aplicadas com sucesso.",
    });
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('personalization-settings');
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram restauradas para o padrão.",
    });
  };

  return {
    settings,
    updateSettings,
    saveSettings,
    resetToDefault
  };
}
