
import { Button } from "@/components/ui/button";

interface ColorPreviewProps {
  primaryColor: string;
  secondaryColor: string;
}

export function ColorPreview({ primaryColor, secondaryColor }: ColorPreviewProps) {
  return (
    <div className="p-4 rounded-lg border-2 border-gray-200">
      <p className="text-sm text-gray-600 mb-2">Preview das cores:</p>
      <div className="flex space-x-2">
        <Button style={{ backgroundColor: primaryColor }}>
          Botão Primário
        </Button>
        <Button 
          variant="outline" 
          style={{ 
            borderColor: secondaryColor, 
            color: secondaryColor 
          }}
        >
          Botão Secundário
        </Button>
      </div>
    </div>
  );
}
