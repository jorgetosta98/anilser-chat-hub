
import { Button } from "@/components/ui/button";

interface ColorPreviewProps {
  primaryColor: string;
  secondaryColor: string;
}

export function ColorPreview({ primaryColor, secondaryColor }: ColorPreviewProps) {
  return (
    <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview das cores:</p>
      <div className="flex space-x-2">
        <Button style={{ backgroundColor: primaryColor, borderColor: primaryColor }}>
          Botão Primário
        </Button>
        <Button 
          variant="outline" 
          style={{ 
            borderColor: secondaryColor, 
            color: secondaryColor 
          }}
          className="hover:bg-opacity-10"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = secondaryColor + '20';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Botão Secundário
        </Button>
      </div>
    </div>
  );
}
