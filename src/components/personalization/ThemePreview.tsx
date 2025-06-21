
interface ThemePreviewProps {
  isDarkMode: boolean;
}

export function ThemePreview({ isDarkMode }: ThemePreviewProps) {
  return (
    <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview do tema:</p>
      <div className={`p-3 rounded ${
        isDarkMode 
          ? 'bg-gray-800 text-white border border-gray-700' 
          : 'bg-white text-gray-900 border border-gray-200'
      }`}>
        <p className="font-medium">Exemplo de texto</p>
        <p className="text-sm opacity-70">Este é um exemplo de como o tema ficará</p>
      </div>
    </div>
  );
}
