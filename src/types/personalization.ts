
export interface PersonalizationSettings {
  isDarkMode: boolean;
  selectedColor: {
    name: string;
    primary: string;
    secondary: string;
  };
  customLogo: string | null;
}

export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
}
