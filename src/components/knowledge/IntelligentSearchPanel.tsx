
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, FileText, Tag, Clock } from 'lucide-react';
import { SmartSearchBar } from './SmartSearchBar';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  summary?: string;
  relevanceScore: number;
  category?: {
    name: string;
    color: string;
  };
  tags: string[];
}

interface IntelligentSearchPanelProps {
  onDocumentSelect: (documentId: string) => void;
}

export function IntelligentSearchPanel({ onDocumentSelect }: IntelligentSearchPanelProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
    setShowResults(true);
  };

  const handleExpandedTerms = (terms: string[]) => {
    setExpandedTerms(terms);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Busca Inteligente com IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SmartSearchBar 
          onSearchResults={handleSearchResults}
          onExpandedTerms={handleExpandedTerms}
        />

        {showResults && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="w-4 h-4" />
                Resultados ({searchResults.length})
              </h3>
              {searchResults.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Ordenado por relevância
                </Badge>
              )}
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum documento encontrado</p>
                <p className="text-sm">Tente ajustar os termos de busca</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onDocumentSelect(result.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-blue-700 hover:text-blue-800">
                        {result.title}
                      </h4>
                      <Badge 
                        className={`text-xs ${getRelevanceColor(result.relevanceScore)}`}
                      >
                        {result.relevanceScore.toFixed(1)}
                      </Badge>
                    </div>

                    {result.summary && (
                      <p className="text-sm text-gray-600 mb-2">
                        {truncateText(result.summary, 120)}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mb-3">
                      {truncateText(result.content, 200)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {result.category && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ backgroundColor: result.category.color + '20' }}
                          >
                            {result.category.name}
                          </Badge>
                        )}
                        {result.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {result.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Relevante
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
