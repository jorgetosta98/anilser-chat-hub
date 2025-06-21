
import { useState } from 'react';
import { Search, Brain, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSmartSearch } from '@/hooks/useSmartSearch';

interface SmartSearchBarProps {
  onSearchResults: (results: any[]) => void;
  onExpandedTerms: (terms: string[]) => void;
}

export function SmartSearchBar({ onSearchResults, onExpandedTerms }: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const { performSmartSearch, isSearching } = useSmartSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await performSmartSearch(query);
      onSearchResults(response);
      
      // Se houver termos expandidos na resposta, mostrá-los
      if (response.length > 0) {
        // Simular termos expandidos baseados na resposta
        const terms = extractRelevantTerms(query);
        setExpandedTerms(terms);
        onExpandedTerms(terms);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const extractRelevantTerms = (searchQuery: string): string[] => {
    // Esta função seria melhorada com a resposta real da IA
    const commonTerms: { [key: string]: string[] } = {
      'segurança': ['proteção', 'prevenção', 'riscos', 'acidentes'],
      'epi': ['equipamento', 'proteção individual', 'capacete', 'luvas'],
      'trabalho': ['ocupacional', 'laboral', 'profissional', 'empresa'],
      'treinamento': ['capacitação', 'curso', 'educação', 'qualificação']
    };

    const queryLower = searchQuery.toLowerCase();
    let terms: string[] = [];

    Object.keys(commonTerms).forEach(key => {
      if (queryLower.includes(key)) {
        terms = [...terms, ...commonTerms[key]];
      }
    });

    return terms.slice(0, 5); // Limitar a 5 termos
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Busca inteligente com IA..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || !query.trim()}
          className="px-6"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Buscar
            </>
          )}
        </Button>
      </div>

      {expandedTerms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Termos relacionados:</span>
          {expandedTerms.map((term, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs cursor-pointer hover:bg-blue-100"
              onClick={() => setQuery(term)}
            >
              {term}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
