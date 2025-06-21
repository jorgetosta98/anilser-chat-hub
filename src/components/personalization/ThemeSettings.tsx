
import { Sun, Moon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemePreview } from "./ThemePreview";

interface ThemeSettingsProps {
  isDarkMode: boolean;
  onThemeChange: (isDarkMode: boolean) => void;
}

export function ThemeSettings({ isDarkMode, onThemeChange }: ThemeSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sun className="w-4 h-4" />
          <Label htmlFor="dark-mode" className="dark:text-gray-300">Modo Escuro</Label>
          <Moon className="w-4 h-4" />
        </div>
        <Switch
          id="dark-mode"
          checked={isDarkMode}
          onCheckedChange={onThemeChange}
        />
      </div>
      <ThemePreview isDarkMode={isDarkMode} />
    </div>
  );
}
