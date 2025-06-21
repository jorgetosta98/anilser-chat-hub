
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
      try {
        console.log('Carregando configurações...', { user: user ? user.id : 'não logado' });
        
        if (user) {
          const userSettings = await loadUserSettings(user.id);
          console.log('Configurações do usuário carregadas:', userSettings);
          setSettings(userSettings);
        } else {
          const localSettings = loadLocalSettings();
          console.log('Configurações locais carregadas:', localSettings);
          setSettings(localSettings);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Apply settings whenever they change
  useEffect(() => {
    console.log('Aplicando configurações de tema:', settings);
    applyThemeSettings(settings);
  }, [settings]);

  // Auto-save settings when they change (except on initial load)
  useEffect(() => {
    if (!loading) {
      const autoSave = async () => {
        console.log('Auto-salvando configurações:', settings);
        
        if (!user) {
          saveLocalSettings(settings);
          return;
        }

        try {
          await saveUserSettings(user.id, settings);
          console.log('Configurações auto-salvas no servidor');
        } catch (error) {
          console.error('Erro no auto-save:', error);
        }
      };

      // Debounce auto-save to avoid too many requests
      const timeoutId = setTimeout(autoSave, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [settings, user, loading]);

  const updateSettings = (newSettings: Partial<PersonalizationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    console.log('Atualizando configurações:', { old: settings, new: updatedSettings });
    setSettings(updatedSettings);
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

    console.log('Iniciando processo de upload...', { fileSize: file.size, fileType: file.type });

    try {
      const logoUrl = await uploadLogoFile(file, user.id);
      if (logoUrl) {
        console.log('Upload concluído com sucesso:', logoUrl);
        return logoUrl;
      } else {
        console.error('Upload falhou - URL nula');
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
    console.log('Salvamento manual das configurações...');
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências de personalização foram aplicadas com sucesso.",
    });
  };

  const resetToDefault = async () => {
    console.log('Resetando para configurações padrão...');
    
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
