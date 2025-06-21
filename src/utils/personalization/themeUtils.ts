
import { PersonalizationSettings } from '@/types/personalization';

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const applyThemeSettings = (settings: PersonalizationSettings) => {
  const html = document.documentElement;
  
  // Apply dark/light theme
  if (settings.isDarkMode) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  // Apply custom colors via CSS variables
  html.style.setProperty('--primary-color', settings.selectedColor.primary);
  html.style.setProperty('--secondary-color', settings.selectedColor.secondary);
  
  // Apply colors to shadcn/ui components
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
