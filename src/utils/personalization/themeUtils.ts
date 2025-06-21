
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
  console.log('Aplicando configurações de tema:', settings);
  
  const html = document.documentElement;
  
  // Apply dark/light theme
  if (settings.isDarkMode) {
    html.classList.add('dark');
    console.log('Modo escuro ativado');
  } else {
    html.classList.remove('dark');
    console.log('Modo claro ativado');
  }

  // Apply custom colors via CSS variables
  html.style.setProperty('--primary-color', settings.selectedColor.primary);
  html.style.setProperty('--secondary-color', settings.selectedColor.secondary);
  
  console.log('Cores customizadas aplicadas:', {
    primary: settings.selectedColor.primary,
    secondary: settings.selectedColor.secondary
  });
  
  // Apply colors to shadcn/ui components
  const primaryRgb = hexToRgb(settings.selectedColor.primary);
  const secondaryRgb = hexToRgb(settings.selectedColor.secondary);
  
  if (primaryRgb) {
    // Apply primary color as RGB values for shadcn components
    html.style.setProperty('--primary', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`);
    
    // Apply to specific UI elements
    html.style.setProperty('--sidebar-primary', settings.selectedColor.primary);
    
    console.log('Cor primária RGB aplicada:', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`);
  }
  
  if (secondaryRgb) {
    // Apply secondary color for accents
    html.style.setProperty('--sidebar-accent', settings.selectedColor.secondary);
    html.style.setProperty('--accent', `${secondaryRgb.r} ${secondaryRgb.g} ${secondaryRgb.b}`);
    
    console.log('Cor secundária aplicada para acentos');
  }

  // Force a reflow to ensure styles are applied immediately
  html.offsetHeight;
  
  console.log('Configurações de tema aplicadas com sucesso');
};
