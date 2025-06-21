
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PersonalizationSettings } from '@/types/personalization';
import { defaultSettings } from '@/constants/personalization';
import { applyThemeSettings } from '@/utils/personalization/themeUtils';
import { 
  loadLocalSettings, 
  saveLocalSettings, 
  loadUserSettings, 
  saveUserSettings, 
  deleteUserSettings 
} from '@/utils/personalization/storageUtils';
import { uploadLogoFile } from '@/utils/personalization/logoUtils';

export function usePersonalization() {
  const [settings, setSettings] = useState<PersonalizationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load user settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        const userSettings = await loadUserSettings(user.id);
        setSettings(userSettings);
      } else {
        const localSettings = loadLocalSettings();
        setSettings(localSettings);
      }
      setLoading(false);
    };

    loadSettings();
  }, [user]);

  // Apply settings whenever they change
  useEffect(() => {
    applyThemeSettings(settings);
  }, [settings]);

  const updateSettings = (newSettings: Partial<PersonalizationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Save locally for immediate response when not logged in
    if (!user) {
      saveLocalSettings(updatedSettings);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer upload da logo.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O logo deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (PNG, JPG, etc.).",
        variant: "destructive",
      });
      return null;
    }

    try {
      const logoUrl = await uploadLogoFile(file, user.id);
      if (logoUrl) {
        return logoUrl;
      } else {
        toast({
          title: "Erro no upload",
          description: "Não foi possível fazer upload da logo.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer upload da logo.",
        variant: "destructive",
      });
      return null;
    }
  };

  const saveSettings = async () => {
    if (!user) {
      saveLocalSettings(settings);
      toast({
        title: "Configurações salvas localmente!",
        description: "Suas preferências foram salvas no navegador.",
      });
      return;
    }

    try {
      await saveUserSettings(user.id, settings);
      toast({
        title: "Configurações salvas!",
        description: "Suas preferências de personalização foram aplicadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const resetToDefault = async () => {
    if (user) {
      try {
        await deleteUserSettings(user.id);
      } catch (error) {
        console.error('Erro ao resetar:', error);
      }
    } else {
      localStorage.removeItem('personalization-settings');
    }
    
    setSettings(defaultSettings);
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram restauradas para o padrão.",
    });
  };

  return {
    settings,
    loading,
    updateSettings,
    saveSettings,
    resetToDefault,
    uploadLogo
  };
}
