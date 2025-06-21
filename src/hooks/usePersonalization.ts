
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Carregar configurações do usuário do Supabase
  useEffect(() => {
    if (user) {
      loadUserSettings();
    } else {
      // Se não estiver logado, usar localStorage como fallback
      loadLocalSettings();
    }
  }, [user]);

  // Aplicar configurações sempre que mudarem
  useEffect(() => {
    applySettings();
  }, [settings]);

  const loadUserSettings = async () => {
    if (!user) return;
    
    try {
      // Using any type temporarily until Supabase types are regenerated
      const { data, error } = await (supabase as any)
        .from('user_personalization')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar configurações:', error);
        setSettings(defaultSettings);
      } else if (data) {
        setSettings({
          isDarkMode: data.is_dark_mode || false,
          selectedColor: {
            name: data.color_name || defaultSettings.selectedColor.name,
            primary: data.primary_color || defaultSettings.selectedColor.primary,
            secondary: data.secondary_color || defaultSettings.selectedColor.secondary
          },
          customLogo: data.logo_url || null
        });
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalSettings = () => {
    const savedSettings = localStorage.getItem('personalization-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações locais:', error);
        setSettings(defaultSettings);
      }
    } else {
      setSettings(defaultSettings);
    }
    setLoading(false);
  };

  const applySettings = () => {
    // Aplicar tema escuro/claro
    const html = document.documentElement;
    if (settings.isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Aplicar cores personalizadas via CSS variables
    html.style.setProperty('--primary-color', settings.selectedColor.primary);
    html.style.setProperty('--secondary-color', settings.selectedColor.secondary);
    
    // Aplicar cores aos componentes shadcn/ui
    const primaryRgb = hexToRgb(settings.selectedColor.primary);
    const secondaryRgb = hexToRgb(settings.selectedColor.secondary);
    
    if (primaryRgb) {
      html.style.setProperty('--primary', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`);
    }
    if (secondaryRgb) {
      html.style.setProperty('--sidebar-primary', settings.selectedColor.primary);
      html.style.setProperty('--sidebar-accent', settings.selectedColor.secondary);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const updateSettings = (newSettings: Partial<PersonalizationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Salvar localmente para resposta imediata
    if (!user) {
      localStorage.setItem('personalization-settings', JSON.stringify(updatedSettings));
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

    try {
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('user-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Erro no upload:', error);
        toast({
          title: "Erro no upload",
          description: "Não foi possível fazer upload da logo.",
          variant: "destructive",
        });
        return null;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('user-logos')
        .getPublicUrl(fileName);

      return publicUrl;
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
      localStorage.setItem('personalization-settings', JSON.stringify(settings));
      toast({
        title: "Configurações salvas localmente!",
        description: "Suas preferências foram salvas no navegador.",
      });
      return;
    }

    try {
      // Using any type temporarily until Supabase types are regenerated
      const { error } = await (supabase as any)
        .from('user_personalization')
        .upsert({
          user_id: user.id,
          is_dark_mode: settings.isDarkMode,
          color_name: settings.selectedColor.name,
          primary_color: settings.selectedColor.primary,
          secondary_color: settings.selectedColor.secondary,
          logo_url: settings.customLogo,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar:', error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as configurações.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Configurações salvas!",
          description: "Suas preferências de personalização foram aplicadas com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const resetToDefault = async () => {
    if (user) {
      try {
        await (supabase as any)
          .from('user_personalization')
          .delete()
          .eq('user_id', user.id);
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
