
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColorPreview } from "./ColorPreview";

interface ColorSelectionProps {
  selectedColor: {
    name: string;
    primary: string;
    secondary: string;
  };
  onColorPresetSelect: (preset: { name: string; primary: string; secondary: string }) => void;
  onCustomColorChange: (type: 'primary' | 'secondary', color: string) => void;
}

const colorPresets = [
  { name: "Verde Safeboy", primary: "#0d9488", secondary: "#14b8a6" },
  { name: "Azul Profissional", primary: "#2563eb", secondary: "#3b82f6" },
  { name: "Roxo Moderno", primary: "#7c3aed", secondary: "#8b5cf6" },
  { name: "Vermelho Energia", primary: "#dc2626", secondary: "#ef4444" },
  { name: "Laranja Criativo", primary: "#ea580c", secondary: "#f97316" },
  { name: "Rosa Elegante", primary: "#e11d48", secondary: "#f43f5e" },
];

export function ColorSelection({ selectedColor, onColorPresetSelect, onCustomColorChange }: ColorSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block dark:text-gray-300">Presets de Cores</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colorPresets.map((preset) => (
            <div
              key={preset.name}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedColor.name === preset.name
                  ? 'border-gray-400 dark:border-gray-500 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              } bg-white dark:bg-gray-700`}
              onClick={() => onColorPresetSelect(preset)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: preset.secondary }}
                />
              </div>
              <p className="text-sm font-medium mt-2 dark:text-gray-300">{preset.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primary-color" className="dark:text-gray-300">Cor Primária</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              type="color"
              id="primary-color"
              value={selectedColor.primary}
              onChange={(e) => onCustomColorChange('primary', e.target.value)}
              className="w-16 h-10 p-1 border dark:bg-gray-700 dark:border-gray-600"
            />
            <Input
              type="text"
              value={selectedColor.primary}
              onChange={(e) => onCustomColorChange('primary', e.target.value)}
              className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="secondary-color" className="dark:text-gray-300">Cor Secundária</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              type="color"
              id="secondary-color"
              value={selectedColor.secondary}
              onChange={(e) => onCustomColorChange('secondary', e.target.value)}
              className="w-16 h-10 p-1 border dark:bg-gray-700 dark:border-gray-600"
            />
            <Input
              type="text"
              value={selectedColor.secondary}
              onChange={(e) => onCustomColorChange('secondary', e.target.value)}
              className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      <ColorPreview
        primaryColor={selectedColor.primary}
        secondaryColor={selectedColor.secondary}
      />
    </div>
  );
}
