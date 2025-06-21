
import { PersonalizationSettings } from '@/types/personalization';
import { defaultSettings } from '@/constants/personalization';
import { supabase } from '@/integrations/supabase/client';

export const loadLocalSettings = (): PersonalizationSettings => {
  const savedSettings = localStorage.getItem('personalization-settings');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      return { ...defaultSettings, ...parsed };
    } catch (error) {
      console.error('Erro ao carregar configurações locais:', error);
      return defaultSettings;
    }
  }
  return defaultSettings;
};

export const saveLocalSettings = (settings: PersonalizationSettings) => {
  localStorage.setItem('personalization-settings', JSON.stringify(settings));
};

export const loadUserSettings = async (userId: string): Promise<PersonalizationSettings> => {
  try {
    // Using any type temporarily until Supabase types are regenerated
    const { data, error } = await (supabase as any)
      .from('user_personalization')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao carregar configurações:', error);
      return defaultSettings;
    } else if (data) {
      return {
        isDarkMode: data.is_dark_mode || false,
        selectedColor: {
          name: data.color_name || defaultSettings.selectedColor.name,
          primary: data.primary_color || defaultSettings.selectedColor.primary,
          secondary: data.secondary_color || defaultSettings.selectedColor.secondary
        },
        customLogo: data.logo_url || null
      };
    }
    return defaultSettings;
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    return defaultSettings;
  }
};

export const saveUserSettings = async (userId: string, settings: PersonalizationSettings) => {
  // Using any type temporarily until Supabase types are regenerated
  const { error } = await (supabase as any)
    .from('user_personalization')
    .upsert({
      user_id: userId,
      is_dark_mode: settings.isDarkMode,
      color_name: settings.selectedColor.name,
      primary_color: settings.selectedColor.primary,
      secondary_color: settings.selectedColor.secondary,
      logo_url: settings.customLogo,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Erro ao salvar:', error);
    throw error;
  }
};

export const deleteUserSettings = async (userId: string) => {
  await (supabase as any)
    .from('user_personalization')
    .delete()
    .eq('user_id', userId);
};
